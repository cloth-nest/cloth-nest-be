import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Permission } from '../../entities';
import * as PermissionData from '../mocks/permission.json';

export class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Permission.name;
    const permissionRepository = dataSource.getRepository(Permission);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await permissionRepository.insert(PermissionData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
