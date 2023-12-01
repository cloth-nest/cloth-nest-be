import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AssignedProductAttributeValues } from '../../entities';
import * as AssignedProductAttributeValuesData from '../mocks/assigned-product-attribute-values.json';

export class AssignedProductAttributeValuesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = AssignedProductAttributeValues.name;
    const assignedProductAttributeValuesRepository = dataSource.getRepository(
      AssignedProductAttributeValues,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await assignedProductAttributeValuesRepository.insert(
      AssignedProductAttributeValuesData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
