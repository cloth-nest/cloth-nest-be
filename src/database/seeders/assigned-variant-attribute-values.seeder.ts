import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AssignedVariantAttributeValues } from '../../entities';
import * as AssignedVariantAttributeValuesData from '../mocks/assigned-product-variant-values.json';

export class AssignedVariantAttributeValuesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = AssignedVariantAttributeValues.name;
    const assignedVariantAttributeValues = dataSource.getRepository(
      AssignedVariantAttributeValues,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await assignedVariantAttributeValues.insert(
      AssignedVariantAttributeValuesData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
