import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permission } from '../enums';
import { RequirePermissions } from './';
import { PermissionsGuard, JwtAuthGuard } from '../guards';

export function Auth(permissions?: Permission[] | Permission) {
  return permissions
    ? applyDecorators(
        // Authentication
        UseGuards(JwtAuthGuard),

        // Authorization
        RequirePermissions(permissions),
        UseGuards(PermissionsGuard),
      )
    : applyDecorators(UseGuards(JwtAuthGuard));
}
