import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

const mailerOptions: MailerOptions = {
  transport: {
    host: process.env.MAILER_HOST || 'smtp.gmail.com',
    service: process.env.MAILER_SERVICE || 'gmail',
    port: parseInt(process.env.MAILER_PORT) || 587,
    secure: Boolean(process.env.MAILER_SECURE) || false,
    auth: {
      user: process.env.MAILER_USER_GMAIL,
      pass: process.env.MAILER_PASS_GMAIL,
    },
  },
  defaults: {
    from: '"Clothnest store" <clothnest@gmail.com>',
  },
};

export default registerAs('mailer', () => mailerOptions);
