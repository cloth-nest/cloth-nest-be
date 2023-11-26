import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductType } from '../../entities';
import * as ProductTypeData from '../mocks/product-type.json';

export class ProductTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductType.name;
    const productTypeRepository = dataSource.getRepository(ProductType);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productTypeRepository.insert(ProductTypeData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
