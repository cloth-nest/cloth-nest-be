import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ReviewImage } from '../../entities';
import * as ReviewImageData from '../mocks/review-image.json';

export class ReviewImageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = ReviewImage.name;
    const reviewImageRepository = dataSource.getRepository(ReviewImage);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await reviewImageRepository.insert(ReviewImageData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
