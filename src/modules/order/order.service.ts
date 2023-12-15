import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  ProductVariant,
  User,
  UserWishlist,
} from '../../entities';
import { DataSource, Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import { GetAllOrdersBelongToUserQueryDTO } from './dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserWishlist)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
    private dataSource: DataSource,
  ) {}
  public async getAllOrderBelongToUser(
    user: AuthUser,
    getAllOrderBelongToUserQueryDTO: GetAllOrdersBelongToUserQueryDTO,
  ) {
    try {
      const { page, limit } = getAllOrderBelongToUserQueryDTO;

      const [orders, total] = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.user_id = :user_id', { user_id: user.id })
        .leftJoinAndSelect('order.address', 'address')
        .select([
          'order.id',
          'order.total',
          'order.status',
          'order.total',
          'order.orderDate',
          'order.deliveryDate',
          'order.shippingFee',
          'order.phone',
          'order.deliveryMethod',
          'order.paymentMethod',
          'address.id',
          'address.detail',
        ])
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: {
          orders,
          pagination: {
            page,
            limit,
            total,
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
