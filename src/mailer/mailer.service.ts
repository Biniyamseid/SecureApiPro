import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'process';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: '',
      port: 1705,
      secure: true,
      auth: {
        user: env.user,
        pass: env.pass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'SecuredApiPro',
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
