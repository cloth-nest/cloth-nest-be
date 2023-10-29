import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { GroupPermission } from '../../entities';
import * as GroupPermissionData from '../mocks/group-permission.json';

export class GroupPermissonSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = GroupPermission.name;
    const groupPermissionRepository = dataSource.getRepository(GroupPermission);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await groupPermissionRepository.insert(GroupPermissionData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
