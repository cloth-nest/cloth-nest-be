import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserGroup } from '../../entities';
import * as UserGroupData from '../mocks/user-group.json';

export class UserGroupSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = UserGroup.name;
    const userGroupRepository = dataSource.getRepository(UserGroup);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await userGroupRepository.insert(UserGroupData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
