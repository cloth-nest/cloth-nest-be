import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductVariant } from '../../entities';
import * as ProductVariantData from '../mocks/product-variant.json';

export class ProductVariantSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductVariant.name;
    const productVariantRepository = dataSource.getRepository(ProductVariant);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productVariantRepository.insert(ProductVariantData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
