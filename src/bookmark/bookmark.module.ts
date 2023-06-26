import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/decorator';

@Module({
  imports:[],
  controllers: [BookmarkController],
  providers: [
    BookmarkService
  ],
})
export class BookmarkModule {}
