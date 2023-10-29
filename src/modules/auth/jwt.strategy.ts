import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from '../../shared/interfaces';
import { AuthService } from './auth.service';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      },
      async (payload: JwtPayload, next: VerifiedCallback) =>
        await this.validate(payload, next),
    );
  }

  /**
   * 1. Lấy payload từ việc decode
   * 2. Tìm user và permission từ email của payload
   * 3. Kiểm tra account activated
   * 4. Gọi verified function
   */
  async validate(payload: JwtPayload, next: VerifiedCallback) {
    let user: AuthUser = undefined;
    try {
      user = await this.authService.validateUser(payload);
    } catch (err) {
      return next(err, null);
    }

    if (!user) {
      return next(new CustomErrorException(ERRORS.Unauthorized));
    }

    next(null, user);
  }
}
