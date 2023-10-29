import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Group } from '../../entities';
import * as GroupData from '../mocks/group.json';

export class GroupSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Group.name;
    const groupRepository = dataSource.getRepository(Group);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await groupRepository.insert(GroupData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
