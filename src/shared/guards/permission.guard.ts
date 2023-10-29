import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums';
import { PERMISSIONS_KEY } from '../decorators';
import { UserRequest } from '../interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<UserRequest>();

    return requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );
  }
}
