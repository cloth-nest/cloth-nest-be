import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductAttribute } from '../../entities';
import * as ProductAttributeData from '../mocks/product-attribute.json';

export class ProductAttributeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductAttribute.name;
    const productAttributeRepository =
      dataSource.getRepository(ProductAttribute);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productAttributeRepository.insert(ProductAttributeData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
