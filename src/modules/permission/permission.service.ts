import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group, GroupPermission, Permission, UserGroup } from '../../entities';
import { GetAllGroupPermissionsQueryDTO } from './dto';
import { paginate } from '../../shared/utils';

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
}
