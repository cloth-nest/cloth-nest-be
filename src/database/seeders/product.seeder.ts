import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Product } from '../../entities';
import * as ProductData from '../mocks/product.json';

export class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Product.name;
    const productRepository = dataSource.getRepository(Product);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productRepository.insert(ProductData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
