import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Sign, randomBytes } from 'crypto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
  
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
  
    if (existingUser) {
      throw new HttpException('Email is already in use. Please choose a different email.', HttpStatus.CONFLICT);
    }
  
    // Generate a random salt
    const salt = randomBytes(32).toString('hex');
  
    // Hash the password with the generated salt
    const hash = await argon.hash(dto.password + salt);
  
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        hash,
        salt,
      } as Prisma.UserCreateInput, // Explicitly cast to the correct type
    });
    delete user.salt;
    delete user.hash;
    return user;
  }
  
  

  async signin(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    const hashedandsaltedpassword = user.hash;

    // compare password
    const pwMatches = await argon.verify(
      hashedandsaltedpassword,
      dto.password+user.salt,
    );
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '1h',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }

  async assignRole(userId: number, requestingUserEmail: string): Promise<User> {
    const requestedUser = await this.prisma.user.findUnique({ where: { id: userId} });
    if (requestedUser){
      console.log(requestedUser);
    }
    else{
      const ans = requestedUser.email !== 'tester@gmail.com';
      console.log({ans,});
    }
    if (!requestedUser || requestingUserEmail !== 'tester@gmail.com') {
      throw new ForbiddenException('Access to resources denied at.');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { roles: { set: ["Moderator"] } },
    });

    return user;
  }
}
