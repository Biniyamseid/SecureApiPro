import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRoles } from 'src/roles/user-roles.decorator';
import { Bookmark, Role, User } from '@prisma/client';
// import { UserRoles } from 'src/roles/user-roles.decorator';


@UseGuards(JwtGuard, RolesGuard)
@Controller('bookmarks')
export class BookmarkController {
  authService: any;
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
    @GetUser('roles') userRole: Role[],
    
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto, userRole);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
// Only users with the Modifier role can access this endpoint
  deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number,@GetUser('roles') userRole: Role[]): Promise<Bookmark|any> {
    console.log(userRole);
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId,userRole);
  }

  @Post('/assign-role')
  async assignRole(
    @Body("id",ParseIntPipe) userId: number,
    @GetUser('email') requestingUserEmail: string,
  ): Promise<User> {
    return this.bookmarkService.assignRole(userId, requestingUserEmail);
  }


}
