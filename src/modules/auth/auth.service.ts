import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResendCodeDto, SignInDto, SignUpDto, VerifyEmailDto } from './dto';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(signUpDto.email);
      if (user) {
        throw new CustomErrorException(ERRORS.EmailExisted);
      }

      // Create new user
      const createdUser = await this.usersService.createNewUser(signUpDto);

      // Send to user gmail
      await this.sendCodeToUserEmail(createdUser.email);

      return {
        message: 'Please, verify email!',
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(
        verifyEmailDto.email,
      );
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check account is active
      if (user.isActive) {
        throw new CustomErrorException(ERRORS.AccountActivatedBefore);
      }

      // Check code valid
      const savedCode = await this.cacheManager.get<number>(
        verifyEmailDto.email,
      );
      if (!savedCode) {
        throw new CustomErrorException(ERRORS.CodeExpired);
      }

      if (savedCode !== verifyEmailDto.code) {
        throw new CustomErrorException(ERRORS.WrongCode);
      }

      // Clear cache, set active account
      await this.cacheManager.del(verifyEmailDto.email);
      await this.usersService.activateAccount(verifyEmailDto.email);

      return { message: 'Account is activated' };
    } catch (err) {
      throw err;
    }
  }

  public async resendCode(resendCodeDto: ResendCodeDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(resendCodeDto.email);
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check account is active
      if (user.isActive) {
        throw new CustomErrorException(ERRORS.AccountActivatedBefore);
      }

      // Send to user gmail
      await this.sendCodeToUserEmail(resendCodeDto.email);

      return {
        message: 'New code was sent your email!',
      };
    } catch (err) {
      throw err;
    }
  }

  public async signIn(signInDto: SignInDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(signInDto.email);
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check valid password
      const isValidPassword = await this.usersService.isValidPassword(
        signInDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new CustomErrorException(ERRORS.WrongPassword);
      }

      // Check account active
      if (!user.isActive) {
        // Send code to active account
        this.sendCodeToUserEmail(user.email);

        throw new CustomErrorException(ERRORS.AccountUnactive);
      }

      // Generate AT & RT
      const payload = {
        user: user.email,
      };

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_RT_EXPIRES_IN'),
      });

      // Save refresh token
      await this.usersService.saveRefreshToken(refreshToken, user.id);

      return {
        data: {
          accessToken: await this.jwtService.signAsync(payload),
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private genCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  private async sendCodeToUserEmail(email: string): Promise<void> {
    // Gen code with 4 number
    const code = this.genCode();

    // Set cache to countdown
    await this.cacheManager.set(email, code);

    // Send to gmail of user
    await this.mailService.sendUserConfirmation(email, code);
  }
}
