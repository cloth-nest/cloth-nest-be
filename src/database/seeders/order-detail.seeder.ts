import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { OrderDetail } from '../../entities';
import * as OrderDetailData from '../mocks/order-detail.json';

export class OrderDetailSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = OrderDetail.name;
    const orderDetailRepository = dataSource.getRepository(OrderDetail);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} \x1b[0m`,
    );
    await orderDetailRepository.insert(OrderDetailData);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
