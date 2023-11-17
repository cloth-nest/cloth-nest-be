import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../entities';
import * as CategoryData from '../mocks/category.json';

export class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Category.name;
    const categoryRepository = dataSource.getRepository(Category);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await categoryRepository.insert(CategoryData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
