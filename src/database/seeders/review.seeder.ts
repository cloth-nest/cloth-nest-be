import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Review } from '../../entities';
import * as ReviewData from '../mocks/review.json';

export class ReviewSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Review.name;
    const reviewRepository = dataSource.getRepository(Review);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await reviewRepository.insert(ReviewData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
