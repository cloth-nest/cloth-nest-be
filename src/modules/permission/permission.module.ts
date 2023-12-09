import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Permission,
  GroupPermission,
  Group,
  UserPermission,
  UserGroup,
} from '../../entities';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      GroupPermission,
      Group,
      UserPermission,
      UserGroup,
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
