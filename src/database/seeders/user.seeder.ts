import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../entities';
import * as UserData from '../mocks/user.json';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = User.name;
    const userRepository = dataSource.getRepository(User);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await userRepository.insert(UserData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
