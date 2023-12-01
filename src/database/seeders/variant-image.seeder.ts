import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { VariantImage } from '../../entities';
import * as VariantImageData from '../mocks/variant-image.json';

export class VariantImageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = VariantImage.name;
    const variantImageRepository = dataSource.getRepository(VariantImage);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await variantImageRepository.insert(VariantImageData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
