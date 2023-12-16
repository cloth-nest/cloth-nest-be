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
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

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
          'order.createdAt',
          'address.id',
          'address.detail',
        ])
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('order.createdAt', 'DESC')
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

  public async getOrderDetail(user: AuthUser, orderId: string) {
    try {
      const orderExist = await this.orderRepo.count({
        where: {
          id: parseInt(orderId),
          userId: user.id,
        },
      });
      if (!orderExist) {
        throw new CustomErrorException(ERRORS.OrderNotExist);
      }

      const order = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.id = :id', { id: orderId })
        .leftJoinAndSelect('order.address', 'address')
        .leftJoinAndSelect('order.orderDetails', 'orderDetails')
        .leftJoinAndSelect('orderDetails.productVariant', 'productVariant')
        .leftJoinAndSelect('productVariant.variantImages', 'variantImages')
        .leftJoinAndSelect('variantImages.productImage', 'image')
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
          'order.createdAt',
          'address.id',
          'address.email',
          'address.lastName',
          'address.firstName',
          'address.provinceName',
          'address.districtName',
          'address.wardName',
          'address.detail',
          'address.phone',
          'address.isAddressProfile',
          'orderDetails.id',
          'orderDetails.quantity',
          'orderDetails.price',
          'productVariant.id',
          'productVariant.name',
          'productVariant.sku',
          'productVariant.price',
          'productVariant.productId',
          'variantImages.id',
          'image.image',
        ])
        .getOne();

      return {
        data: {
          order: {
            ...order,
            orderDetails: order.orderDetails.map((detail) => ({
              ...detail,
              productVariant: {
                id: detail.productVariant.id,
                name: detail.productVariant.name,
                sku: detail.productVariant.sku,
                price: detail.productVariant.price,
                productId: detail.productVariant.productId,
                image:
                  detail.productVariant.variantImages[0].productImage.image,
              },
            })),
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
