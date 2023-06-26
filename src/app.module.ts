import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import {AppController} from './app.controller';
import { CookieParserMiddleware } from './common/middlewares/Cookieparser.middleware';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { sessionConfig } from './common/configuration/session.config';
import { MailerService } from './mailer/mailer.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [MailerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware,).forRoutes('*');
    consumer.apply(session(sessionConfig)).forRoutes('*');
  }
}

