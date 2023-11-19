import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../entities';
import * as CategoryData from '../mocks/category.json';

export class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Category.name;
    const categoryRepository = dataSource.getTreeRepository(Category);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );

    for (const node of CategoryData) {
      const categoryLevel0 = categoryRepository.create({
        name: node.name,
        description: node.description,
        level: node.level,
      });
      await categoryRepository.save(categoryLevel0);
      if (node.childs) {
        for (const child of node.childs) {
          const categoryLevel1 = categoryRepository.create({
            name: child.name,
            description: child.description,
            level: child.level,
          });
          categoryLevel1.parent = categoryLevel0;
          await categoryRepository.save(categoryLevel1);

          if (child.childs) {
            for (const child2 of child.childs) {
              const categoryLevel2 = categoryRepository.create({
                name: child2.name,
                description: child2.description,
                level: child2.level,
              });
              categoryLevel2.parent = categoryLevel1;
              await categoryRepository.save(categoryLevel2);
            }
          }
        }
      }
    }

    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
