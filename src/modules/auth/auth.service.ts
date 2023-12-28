import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  RefreshTokenDto,
  ResendCodeDto,
  ResetPasswordDto,
  SignInDto,
  SignOutDto,
  SignUpDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from '../../shared/interfaces';

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
        `${verifyEmailDto.email}-code`,
      );
      if (!savedCode) {
        throw new CustomErrorException(ERRORS.CodeExpired);
      }

      if (savedCode !== verifyEmailDto.code) {
        throw new CustomErrorException(ERRORS.WrongCode);
      }

      // Clear cache, set active account
      await this.cacheManager.del(`${verifyEmailDto.email}-code`);
      await this.usersService.activateAccount(verifyEmailDto.email);

      return { message: 'Account is activated' };
    } catch (err) {
      throw err;
    }
  }

  public async verifyEmailSignIn(verifyEmailDto: VerifyEmailDto) {
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
        `${verifyEmailDto.email}-code`,
      );
      if (!savedCode) {
        throw new CustomErrorException(ERRORS.CodeExpired);
      }

      if (savedCode !== verifyEmailDto.code) {
        throw new CustomErrorException(ERRORS.WrongCode);
      }

      // Clear cache, set active account
      await this.cacheManager.del(`${verifyEmailDto.email}-code`);
      await this.usersService.activateAccount(verifyEmailDto.email);

      // Create payload
      const payload: JwtPayload = {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };

      // Create RT, AT
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('JWT_RT_EXPIRES_IN'),
      });
      const accessToken = await this.jwtService.signAsync(payload);

      // Save AT to cache
      await this.cacheManager.set(
        `${user.email}-at`,
        accessToken,
        this.configService.get<number>('JWT_AT_EXPIRES_IN') * 1000,
      );

      // Save refresh token
      await this.usersService.saveRefreshToken(refreshToken, user.id);

      return {
        data: {
          accessToken,
          refreshToken,
        },
      };
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
      // Destruct body
      const { firebaseToken } = signInDto;

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

      // Create payload
      const payload: JwtPayload = {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };

      // Create RT, AT
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('JWT_RT_EXPIRES_IN'),
      });
      const accessToken = await this.jwtService.signAsync(payload);

      // Save AT to cache
      await this.cacheManager.set(
        `${user.email}-at`,
        accessToken,
        this.configService.get<number>('JWT_AT_EXPIRES_IN') * 1000,
      );

      // Save refresh token
      await this.usersService.saveRefreshToken(refreshToken, user.id);

      // Save firebase token if exist
      if (firebaseToken) {
        await this.usersService.saveFirebaseToken(firebaseToken, user.id);
      }

      return {
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      /*
       * 1. Verify token return user
       * 2. Get payload
       * 3. Từ payload tìm user
       * 4. So sánh refresh token
       * 5. Xóa refresh token
       * 6. Tạo RT, AT trả về
       */

      // Verify token & get payload
      const { email } = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      );

      // Find user and compare stored refresh token
      const user = await this.usersService.findUserByEmail(email);
      if (user.refreshToken !== refreshTokenDto.refreshToken) {
        throw new CustomErrorException(ERRORS.WrongRefreshToken);
      }

      // Create payload
      const payload: JwtPayload = {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };

      // Create RT
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('JWT_RT_EXPIRES_IN'),
      });

      // Save refresh token
      await this.usersService.saveRefreshToken(refreshToken, user.id);

      return {
        data: {
          accessToken: await this.jwtService.signAsync(payload),
          refreshToken,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async signOut(signOutDto: SignOutDto) {
    try {
      /*
       * 1. Check exist RT in body request
       * 2. Verify get payload
       * 3. Find user with email
       * 4. Clear RT in db
       * 5. Clear user's cache
       */

      // Verify token & get payload
      const { email } = await this.jwtService.verifyAsync<JwtPayload>(
        signOutDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      );

      // Find user and compare stored refresh token
      const user = await this.usersService.findUserByEmail(email);
      if (user.refreshToken !== signOutDto.refreshToken) {
        throw new CustomErrorException(ERRORS.WrongRefreshToken);
      }

      // Clear user's cache & stored RT
      await this.clearCacheUser(user.email);
      await this.usersService.removeRefreshToken(user.id);

      return {
        message: 'Sign out successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(
        forgetPasswordDto.email,
      );
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check account active
      if (!user.isActive) {
        // Send code to active account
        this.sendCodeToUserEmail(user.email);

        throw new CustomErrorException(ERRORS.AccountUnactive);
      }

      // Create code & send to user email
      await this.sendCodeToUserEmail(user.email);

      return {
        message: 'Code is sent to your email. Please, verify it!',
      };
    } catch (err) {
      throw err;
    }
  }

  public async verifyForgetPassword(
    verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(
        verifyForgetPasswordDto.email,
      );
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check account active
      if (!user.isActive) {
        // Send code to active account
        this.sendCodeToUserEmail(user.email);

        throw new CustomErrorException(ERRORS.AccountUnactive);
      }

      // Check code valid
      const savedCode = await this.cacheManager.get<number>(
        `${verifyForgetPasswordDto.email}-code`,
      );
      if (!savedCode) {
        throw new CustomErrorException(ERRORS.CodeExpired);
      }

      if (savedCode !== verifyForgetPasswordDto.code) {
        throw new CustomErrorException(ERRORS.WrongCode);
      }

      // Clear cache & create reset password session
      await this.cacheManager.del(`${verifyForgetPasswordDto.email}-code`);
      await this.cacheManager.set(
        `${verifyForgetPasswordDto.email}-reset-pw-session`,
        true,
        300000, // 5 minutes
      );

      return {
        message: 'Verify success, next step reset password',
      };
    } catch (err) {
      throw err;
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(
        resetPasswordDto.email,
      );
      if (!user) {
        throw new CustomErrorException(ERRORS.EmailNotRegisterd);
      }

      // Check account active
      if (!user.isActive) {
        // Send code to active account
        this.sendCodeToUserEmail(user.email);

        throw new CustomErrorException(ERRORS.AccountUnactive);
      }

      // Check in session
      const sessionResetPassword = await this.cacheManager.get<boolean>(
        `${resetPasswordDto.email}-reset-pw-session`,
      );
      if (!sessionResetPassword) {
        throw new CustomErrorException(ERRORS.SessionResetPassword);
      }

      // Reset password
      await this.usersService.resetPassword(
        user.id,
        resetPasswordDto.newPassword,
      );

      // Clear cache
      await this.cacheManager.del(`${resetPasswordDto.email}-reset-pw-session`);

      return {
        message: 'Reset password successfully. Go to sign in',
      };
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(
    currentUser: AuthUser,
    changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const { newPassword, oldPassword } = changePasswordDto;
      if (newPassword === oldPassword) {
        throw new CustomErrorException(ERRORS.NewPasswordMatchOldPassword);
      }

      // Check valid password
      const isValidPassword = await this.usersService.isValidPassword(
        oldPassword,
        currentUser.password,
      );
      if (!isValidPassword) {
        throw new CustomErrorException(ERRORS.WrongPassword);
      }

      // Reset password
      await this.usersService.resetPassword(currentUser.id, newPassword);

      return {
        message: 'Change password successfully',
        data: changePasswordDto,
      };
    } catch (err) {
      throw err;
    }
  }

  public async validateUser(payload: JwtPayload): Promise<AuthUser | null> {
    try {
      // Check user exists and user permission
      const user = await this.usersService.getAuthenticatedUser(payload.userId);

      if (!user) {
        return null;
      }

      // Check account active
      if (!user.isActive) {
        throw new CustomErrorException(ERRORS.AccountUnactive);
      }

      return user;
    } catch (err) {
      throw new CustomErrorException(ERRORS.InternalServerError);
    }
  }

  private genCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  private async clearCacheUser(email: string): Promise<void> {
    await this.cacheManager.del(`${email}-code`);
    await this.cacheManager.del(`${email}-at`);
  }

  private async sendCodeToUserEmail(email: string): Promise<void> {
    // Gen code with 4 number
    const code = this.genCode();

    // Set cache to countdown
    await this.cacheManager.set(`${email}-code`, code);

    // Send to gmail of user
    await this.mailService.sendUserConfirmation(email, code);
  }
}
