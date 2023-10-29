import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (permissions: Permission[] | Permission) =>
  SetMetadata(
    PERMISSIONS_KEY,
    Array.isArray(permissions) ? permissions : [permissions],
  );
