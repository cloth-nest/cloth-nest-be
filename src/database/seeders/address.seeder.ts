import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Address } from '../../entities';
import * as AddressData from '../mocks/address.json';

export class AddressSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Address.name;
    const addressRepository = dataSource.getRepository(Address);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await addressRepository.insert(AddressData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
