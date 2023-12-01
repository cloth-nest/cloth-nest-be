import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AssignedProductAttribute } from '../../entities';
import * as AssignedProductAttributeData from '../mocks/assigned-product-attribute.json';

export class AssignedProductAttributeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = AssignedProductAttribute.name;
    const assignedProductAttributeRepository = dataSource.getRepository(
      AssignedProductAttribute,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await assignedProductAttributeRepository.insert(
      AssignedProductAttributeData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
