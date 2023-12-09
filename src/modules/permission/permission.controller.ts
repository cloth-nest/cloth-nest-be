import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import {
  GetAllGroupPermissionsQueryDTO,
  GetAllPermissionsQueryDTO,
} from './dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Auth(Permission.MANAGE_STAFF)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllPermissions(
    @Query()
    getAllPermissionsDTO: GetAllPermissionsQueryDTO,
  ) {
    return this.permissionService.getAllPermissions(getAllPermissionsDTO);
  }

  @Auth(Permission.MANAGE_STAFF)
  @Get('group')
  @HttpCode(HttpStatus.OK)
  getAllGroupPermissions(
    @Query()
    getAllGroupPermissionsDTO: GetAllGroupPermissionsQueryDTO,
  ) {
    return this.permissionService.getAllGroupPermissions(
      getAllGroupPermissionsDTO,
    );
  }
}
