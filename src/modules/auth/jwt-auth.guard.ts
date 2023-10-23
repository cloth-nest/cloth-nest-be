import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(JwtService) private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const payload = this.jwtService.decode(token);

    try {
      this.cacheManager
        .get<string>(`${payload['email']}-at`)
        .then((at: string) => at === token);
    } catch (err) {
      return false;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new CustomErrorException(ERRORS.Unauthorized);
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
