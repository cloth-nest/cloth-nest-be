import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductTypeProductVariant } from '../../entities';
import * as ProductTypeProductVariantData from '../mocks/product-type-product-variant.json';

export class ProductTypeProductVariantSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductTypeProductVariant.name;
    const productTypeProductVariantRepository = dataSource.getRepository(
      ProductTypeProductVariant,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productTypeProductVariantRepository.insert(
      ProductTypeProductVariantData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
