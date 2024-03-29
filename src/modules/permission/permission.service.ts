import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Group, GroupPermission, Permission, UserGroup } from '../../entities';
import {
  CreateGroupPermissionBodyDto,
  CreateOnePermissionBodyDto,
  GetAllGroupPermissionsQueryDTO,
  GetAllPermissionsQueryDTO,
  UpdateGroupPermissionBodyDto,
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
    @InjectRepository(UserGroup)
    private userGroupRepo: Repository<UserGroup>,
    private dataSource: DataSource,
  ) {}
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

  public async createGroupPermission(
    createGroupPermissionBodyDto: CreateGroupPermissionBodyDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { groupPermissionName, permissionIds } =
        createGroupPermissionBodyDto;

      const groupPermission = await this.groupRepo.count({
        where: {
          name: groupPermissionName,
        },
      });

      if (groupPermission) {
        throw new CustomErrorException(ERRORS.GroupPermissionAlreadyExist);
      }

      const createdGroup = await queryRunner.manager.save(Group, {
        name: groupPermissionName,
      });

      if (!permissionIds) {
        await queryRunner.commitTransaction();
        return {
          message: 'Create group permission successfully',
          data: _.omit(createdGroup, ['createdAt', 'updatedAt']),
        };
      }

      let groupPermissions: GroupPermission[] = undefined;
      const countedPermissions = await this.permissionRepo.count({
        where: {
          id: In(permissionIds),
        },
      });

      if (countedPermissions !== permissionIds.length) {
        throw new CustomErrorException(ERRORS.PermissionNotExist);
      }

      groupPermissions = await queryRunner.manager.save(
        GroupPermission,
        permissionIds.map((permissionId) =>
          this.groupPermissionRepo.create({
            permissionId,
            groupId: createdGroup.id,
          }),
        ),
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Create group permission successfully',
        data: {
          id: createdGroup.id,
          name: createdGroup.name,
          groupPermission: groupPermissions.map((groupPermission) =>
            _.omit(groupPermission, ['createdAt', 'updatedAt']),
          ),
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async updateGroupPermission(
    groupPermissionId: string,
    updateGroupPermissionBodyDto: UpdateGroupPermissionBodyDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { groupPermissionName, permissionIds } =
        updateGroupPermissionBodyDto;

      const groupPermission = await this.groupRepo.count({
        where: {
          id: parseInt(groupPermissionId),
        },
      });

      if (!groupPermission) {
        throw new CustomErrorException(ERRORS.GroupPermissionNotExist);
      }

      if (groupPermissionName) {
        const groupPermissionNameExist = await this.groupRepo.count({
          where: {
            name: groupPermissionName,
          },
        });
        if (groupPermissionNameExist) {
          throw new CustomErrorException(ERRORS.GroupPermissionAlreadyExist);
        }

        await queryRunner.manager.update(
          Group,
          { id: parseInt(groupPermissionId) },
          { name: groupPermissionName },
        );
      }

      let groupPermissions: GroupPermission[] = undefined;
      if (permissionIds) {
        const countedPermissions = await this.permissionRepo.count({
          where: {
            id: In(permissionIds),
          },
        });

        if (countedPermissions !== permissionIds.length) {
          throw new CustomErrorException(ERRORS.PermissionNotExist);
        }

        await queryRunner.manager.delete(GroupPermission, {
          groupId: parseInt(groupPermissionId),
        });
        groupPermissions = await queryRunner.manager.save(
          GroupPermission,
          permissionIds.map((permissionId) =>
            this.groupPermissionRepo.create({
              permissionId,
              groupId: parseInt(groupPermissionId),
            }),
          ),
        );
      }

      await queryRunner.commitTransaction();

      return {
        message: 'Update group permission successfully',
        data: {
          id: parseInt(groupPermissionId),
          name: groupPermissionName,
          groupPermission: groupPermissions.map((groupPermission) =>
            _.omit(groupPermission, ['createdAt', 'updatedAt']),
          ),
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteGroupPermission(groupPermissionId: string) {
    const groupPermission = await this.groupRepo.count({
      where: {
        id: parseInt(groupPermissionId),
      },
    });

    if (!groupPermission) {
      throw new CustomErrorException(ERRORS.GroupPermissionNotExist);
    }

    const userGroup = await this.userGroupRepo.count({
      where: {
        groupId: parseInt(groupPermissionId),
      },
    });

    if (userGroup) {
      throw new CustomErrorException(ERRORS.GroupPermissionIsUsing);
    }

    const userPermission = await this.groupPermissionRepo.count({
      where: {
        groupId: parseInt(groupPermissionId),
      },
    });

    if (userPermission) {
      throw new CustomErrorException(ERRORS.GroupPermissionIsUsing);
    }

    await this.groupRepo.delete(groupPermissionId);

    return {
      message: 'Delete group permission successfully',
      data: {
        id: parseInt(groupPermissionId),
      },
    };
  }

  public async getGroupPermissionDetail(groupPermissionId: string) {
    const groupPermission = await this.groupRepo.findOne({
      where: {
        id: parseInt(groupPermissionId),
      },
    });

    if (!groupPermission) {
      throw new CustomErrorException(ERRORS.GroupPermissionNotExist);
    }

    const groupPermissions = await this.groupPermissionRepo
      .createQueryBuilder('gp')
      .select(['p.id AS "id"', 'p.name AS "name"'])
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(*)::int as count')
            .from(UserGroup, 'ug')
            .where('ug.group_id = gp.group_id'),
        'groupPermissionsCount',
      )
      .leftJoin(Permission, 'p', 'p.id = gp.permission_id')
      .where('gp.group_id = :groupId', { groupId: parseInt(groupPermissionId) })
      .getRawMany();

    return {
      data: {
        id: parseInt(groupPermissionId),
        name: groupPermission.name,
        groupPermissions,
      },
    };
  }
}
