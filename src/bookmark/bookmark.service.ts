import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import { Bookmark, Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';




@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
    @GetUser('roles') userRoles: Role[],
  ) {
    // get the bookmark by id
    if (!userRoles || !userRoles.includes(Role.Moderator)){
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
    userRoles: Role[],
  ) : Promise<Bookmark|any>{
 
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if there is a bookmark with the id
    if (!bookmark)
      throw new ForbiddenException(
        'requested bookmark does not exist',
      );

    const deleteBookmark = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    console.log("deleted successfully")
    return {deleteBookmark,};
  }
  async assignRole(userId: number, requestingUserEmail: string): Promise<User> {
    const requestedUser = await this.prisma.user.findUnique({ where: { id: userId} });

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

