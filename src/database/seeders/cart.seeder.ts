import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Cart } from '../../entities';
import * as CartData from '../mocks/cart.json';

export class CartSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Cart.name;
    const cartRepository = dataSource.getRepository(Cart);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await cartRepository.insert(CartData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
