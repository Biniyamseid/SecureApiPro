// app.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  @Get()
  setCookie(@Res() res: Response) {
    // Set a cookie
    res.cookie('myCookie', 'cookieValue', {
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
      httpOnly: true,
      secure: true, // Set to true if served over HTTPS
      sameSite: 'strict', // or 'lax'
    });

    res.send('Cookie set successfully');
  }

  @Get('read-cookie')
  readCookie(@Req() req: Request) {
    // Read a cookie
    const myCookie = req.cookies.myCookie;

    return `Cookie value: ${myCookie}`;
  }

  @Get('delete-cookie')
  deleteCookie(@Res() res: Response) {
    // Delete a cookie
    res.clearCookie('myCookie');

    res.send('Cookie deleted successfully');
  }
}
