import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Order } from '../../entities';
import * as OrderData from '../mocks/order.json';

export class OrderSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Order.name;
    const orderRepository = dataSource.getRepository(Order);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );

    await orderRepository.insert(OrderData as any[]);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
