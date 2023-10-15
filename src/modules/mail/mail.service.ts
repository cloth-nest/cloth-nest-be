import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERRORS } from 'src/shared/constants';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { CustomError } from 'src/shared/types';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, code: number): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Clothnest store! Confirm your Email',
        text: `Hi user with email is ${email}, your code to confirm is ${code}`,
      });
    } catch (err) {
      const errRes: CustomError = {
        ...ERRORS.MailerError,
        message: err.message,
      };
      throw new CustomErrorException(errRes);
    }
  }

  async sendEmailForgotPassword(email: string, token: string) {
    const mailOptions: ISendMailOptions = {
      from: '"Vitalify Asia" <' + email,
      to: email,
      subject: 'Forgotten password',
      text: 'Forgot password',
      html:
        `Hi! <br><br> Your password reset code is: ${token}<br><br>` +
        'This is a security token, please do not share it with anyone',
    };

    await this.mailerService.sendMail(mailOptions);
  }
}
