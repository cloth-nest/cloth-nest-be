import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
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
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('verify-email-sign-in')
  @HttpCode(HttpStatus.OK)
  verifyEmailSignIn(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmailSignIn(verifyEmailDto);
  }

  @Post('resend-code')
  @HttpCode(HttpStatus.CREATED)
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendCode(resendCodeDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Body() signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto);
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('verify-forget-password')
  @HttpCode(HttpStatus.OK)
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPassword(verifyForgetPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Auth()
  @Post('change-password')
  @HttpCode(HttpStatus.ACCEPTED)
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }
}
