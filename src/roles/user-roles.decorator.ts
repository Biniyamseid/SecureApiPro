import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from './roles.enum';
import { GetUser } from 'src/auth/decorator';
// import { User } from '../auth/user.entity';

export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Role[] => {
    const request = ctx.switchToHttp().getRequest();
    const user= request.user;
    return user.roles; // Assuming roles are stored in the user object
  },
);