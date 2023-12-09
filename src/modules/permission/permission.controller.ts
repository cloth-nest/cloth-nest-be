import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import {
  CreateOnePermissionBodyDto,
  DeletePermissionParamDto,
  GetAllGroupPermissionsQueryDTO,
  GetAllPermissionsQueryDTO,
  UpdatePermissionBodyDto,
  UpdatePermissionParamDto,
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
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createPermission(
    @Body()
    createOnePermissionBodyDto: CreateOnePermissionBodyDto,
  ) {
    return this.permissionService.createPermission(createOnePermissionBodyDto);
  }

  @Auth(Permission.MANAGE_STAFF)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updatePermission(
    @Param() param: UpdatePermissionParamDto,
    @Body()
    updatePermissionBodyDto: UpdatePermissionBodyDto,
  ) {
    return this.permissionService.updatePermission(
      param.id,
      updatePermissionBodyDto,
    );
  }

  @Auth(Permission.MANAGE_STAFF)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deletePermission(@Param() param: DeletePermissionParamDto) {
    return this.permissionService.deletePermission(param.id);
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
