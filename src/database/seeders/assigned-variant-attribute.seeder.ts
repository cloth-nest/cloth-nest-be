import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AssignedVariantAttribute } from '../../entities';
import * as AssignedVariantAttributeData from '../mocks/assigned-product-variant.json';

export class AssignedVariantAttributeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = AssignedVariantAttribute.name;
    const assignedVariantAttributeRepository = dataSource.getRepository(
      AssignedVariantAttribute,
    );

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await assignedVariantAttributeRepository.insert(
      AssignedVariantAttributeData,
    );
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
