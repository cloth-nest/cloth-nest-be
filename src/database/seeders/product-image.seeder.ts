import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ProductImage } from '../../entities';
import * as ProductImageData from '../mocks/product-image.json';

export class ProductImageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ProductImage.name;
    const productImageRepository = dataSource.getRepository(ProductImage);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await productImageRepository.insert(ProductImageData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
