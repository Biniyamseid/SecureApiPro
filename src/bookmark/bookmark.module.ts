import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';

@Module({
  controllers: [BookmarkController],
  providers: [
    // ...
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply the RolesGuard globally
    },
    BookmarkService
  ],
})
export class BookmarkModule {}
