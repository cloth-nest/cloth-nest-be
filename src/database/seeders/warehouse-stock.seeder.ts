import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { WarehouseStock } from '../../entities';
import * as WarehouseStockData from '../mocks/warehouse-stock.json';

export class WarehouseStockSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = WarehouseStock.name;
    const warehouseStockRepository = dataSource.getRepository(WarehouseStock);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await warehouseStockRepository.insert(WarehouseStockData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
