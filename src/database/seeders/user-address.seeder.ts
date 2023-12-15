import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserAddress } from '../../entities';
import * as UserAddressData from '../mocks/user-address.json';

export class UserAddressSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = UserAddress.name;
    const userAddressRepository = dataSource.getRepository(UserAddress);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await userAddressRepository.insert(UserAddressData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
