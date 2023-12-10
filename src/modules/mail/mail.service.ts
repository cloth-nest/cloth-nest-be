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

  async sendUserStaffPassword(
    email: string,
    firstName: string,
    password: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your New Temporary Password',
        text: `New temporary password`,
        html: `<p>Dear ${firstName},</p>

          <p>We hope this message finds you well. As part of our regular security measures, we have generated a new temporary password for your account.</p>

          <p><strong>Temporary Password:</strong> ${password}</p>

          <p>For security reasons, we recommend that you change this temporary password immediately upon logging in. To do so, please follow these steps:</p>

          <ol>
            <li>Visit our login page</li>
            <li>Enter your username: ${email}</li>
            <li>Use the temporary password provided above.</li>
            <li>Follow the prompts to create a new, secure password.</li>
          </ol>

          <p>If you encounter any issues or have questions, please don't hesitate to reach out to our support team at <a href="mailto:[maiphamquochung@gmail.com]">[SupportEmail]</a> or call us at [+84 39 972 0685].</p>

          <p>Thank you for your cooperation in maintaining the security of our systems.</p>

          <p>Best regards,<br>
            Clothnest store Corp<br>
            maiphamquochung@gmail.com</p>`,
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
      from: '"Clothnest " <' + email,
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
