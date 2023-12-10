import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserWishlist } from '../../entities';
import * as UserWishlistData from '../mocks/user-wishlist.json';

export class UserWishlistSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = UserWishlist.name;
    const userWishlistRepository = dataSource.getRepository(UserWishlist);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await userWishlistRepository.insert(UserWishlistData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
