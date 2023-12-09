import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group, GroupPermission, Permission, UserGroup } from '../../entities';
import {
  CreateOnePermissionBodyDto,
  GetAllGroupPermissionsQueryDTO,
  GetAllPermissionsQueryDTO,
  UpdatePermissionBodyDto,
} from './dto';
import { paginate } from '../../shared/utils';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import * as _ from 'lodash';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(GroupPermission)
    private groupPermissionRepo: Repository<GroupPermission>,
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
  ) {}

  public async getAllGroupPermissions(
    getAllGroupPermissionsDTO: GetAllGroupPermissionsQueryDTO,
  ) {
    // Destructor query
    const { limit, page } = getAllGroupPermissionsDTO;

    const [groupPermissions, total] = await Promise.all([
      this.groupRepo
        .createQueryBuilder('g')
        .select(['g.id AS "id"', 'g.name AS "name"'])
        .addSelect(
          (qb) =>
            qb
              .select('COUNT(*)::int as count')
              .from(UserGroup, 'ug')
              .where('ug.group_id = g.id'),
          'members',
        )
        .orderBy('g.name', 'ASC')
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany(),
      this.groupRepo.count(),
    ]);

    return {
      data: {
        groupPermissions,
        pageInformation: paginate(limit, page, total),
      },
    };
  }

  public async getAllPermissions(
    getAllPermissionsDTO: GetAllPermissionsQueryDTO,
  ) {
    // Destructor query
    const { limit, page } = getAllPermissionsDTO;

    const [permissions, total] = await Promise.all([
      this.permissionRepo
        .createQueryBuilder('p')
        .select(['p.id AS "id"', 'p.name AS "name"'])
        .addSelect(
          (qb) =>
            qb
              .select('COUNT(*)::int as count')
              .from(GroupPermission, 'g')
              .where('g.permission_id = p.id'),
          'groupPermissionsCount',
        )
        .orderBy('p.name', 'ASC')
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany(),
      this.permissionRepo.count(),
    ]);

    return {
      data: {
        permissions,
        pageInformation: paginate(limit, page, total),
      },
    };
  }

  public async createPermission(
    createOnePermissionBodyDto: CreateOnePermissionBodyDto,
  ) {
    const { permissionName, permissionCode } = createOnePermissionBodyDto;

    const permission = await this.permissionRepo.findOne({
      where: [{ name: permissionName }, { codeName: permissionCode }],
    });

    if (permission) {
      throw new CustomErrorException(ERRORS.PermissionAlreadyExist);
    }

    const createdPermission = await this.permissionRepo.save({
      name: permissionName,
      codeName: permissionCode,
    });

    return {
      data: {
        data: _.omit(createdPermission, ['createdAt', 'updatedAt']),
        message: 'Create permission successfully',
      },
    };
  }

  public async updatePermission(
    permissionId: string,
    updatePermissionBodyDto: UpdatePermissionBodyDto,
  ) {
    const { permissionName, permissionCode } = updatePermissionBodyDto;

    const permission = await this.permissionRepo.count({
      where: {
        id: parseInt(permissionId),
      },
    });

    if (!permission) {
      throw new CustomErrorException(ERRORS.PermissionNotExist);
    }

    const permissionCodeNameExist = await this.permissionRepo.count({
      where: [{ name: permissionName }, { codeName: permissionCode }],
    });

    if (permissionCodeNameExist) {
      throw new CustomErrorException(ERRORS.PermissionAlreadyExist);
    }

    await this.permissionRepo.update(parseInt(permissionId), {
      name: permissionName,
      codeName: permissionCode,
    });

    return {
      message: 'Update permission successfully',
      data: {
        id: parseInt(permissionId),
        name: permissionName,
        code: permissionCode,
      },
    };
  }

  public async deletePermission(permissionId: string) {
    const permission = await this.permissionRepo.count({
      where: {
        id: parseInt(permissionId),
      },
    });

    if (!permission) {
      throw new CustomErrorException(ERRORS.PermissionNotExist);
    }

    const groupPermission = await this.groupPermissionRepo.count({
      where: {
        permissionId: parseInt(permissionId),
      },
    });

    if (groupPermission) {
      throw new CustomErrorException(ERRORS.PermissionIsUsing);
    }

    await this.permissionRepo.delete(permissionId);

    return {
      message: 'Delete permission successfully',
      data: {
        id: parseInt(permissionId),
      },
    };
  }
}
