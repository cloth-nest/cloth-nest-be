import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  ProductVariant,
  User,
  UserWishlist,
  Warehouse,
  WarehouseStock,
} from '../../entities';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderLine } from './order-line.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserWishlist,
      ProductVariant,
      Order,
      OrderDetail,
      Warehouse,
      WarehouseStock,
    ]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderLine',
      useClass: OrderLine,
    },
    OrderService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
