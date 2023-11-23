import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AttributeValue } from '../../entities';
import * as AttributeValueData from '../mocks/attribute-value.json';

export class AttributeValueSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = AttributeValue.name;
    const attributeValueRepository = dataSource.getRepository(AttributeValue);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await attributeValueRepository.insert(AttributeValueData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
