import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductTypeProductAttribute } from '../../entities';
import * as ProductTypeProductAttributeData from '../mocks/product-type-product-attribute.json';

export class ProductTypeProductAttributeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductTypeProductAttribute.name;
    const productTypeProductAttributeRepository = dataSource.getRepository(
      ProductTypeProductAttribute,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productTypeProductAttributeRepository.insert(
      ProductTypeProductAttributeData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
