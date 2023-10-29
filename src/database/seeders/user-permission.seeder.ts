import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserPermission } from '../../entities';
import * as UserPermissionData from '../mocks/user-permission.json';

export class UserPermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = UserPermission.name;
    const userPermissionRepository = dataSource.getRepository(UserPermission);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await userPermissionRepository.insert(UserPermissionData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
