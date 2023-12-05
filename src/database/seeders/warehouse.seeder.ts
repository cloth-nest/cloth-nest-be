import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Warehouse } from '../../entities';
import * as WarehouseData from '../mocks/warehouse.json';

export class WarehouseSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Warehouse.name;
    const warehouseRepository = dataSource.getRepository(Warehouse);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await warehouseRepository.insert(WarehouseData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
