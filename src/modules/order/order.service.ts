import { Inject, Injectable } from '@nestjs/common';
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
import {
  CalcBillBodyDto,
  CreateOrderWithCartBodyDto,
  GetAllOrdersBelongToUserQueryDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { OrderLine } from './order-line.service';

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
    @Inject('OrderLine')
    private readonly orderLine: OrderLine,
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

  public async checkInventory(user: AuthUser) {
    try {
      const { cart, warehouseStock, errors } =
        await this.orderLine.checkInventory({
          user,
        });

      const warehouseStockFilter = warehouseStock.filter((warehouseItem) => {
        const { variantId, quantity } = warehouseItem;
        const cartItem = cart.find(
          (cartItem) => cartItem.productVariantId === variantId,
        );
        return cartItem && quantity < cartItem.quantity;
      });

      return {
        data: {
          isAvailable: !errors,
          cart: errors ? cart : undefined,
          warehouseStock: errors ? warehouseStockFilter : undefined,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async calcBill(user: AuthUser, calcBillBodyDto: CalcBillBodyDto) {
    try {
      const { addressId, ghnServerTypeId } = calcBillBodyDto;

      const { bill, cart } = await this.orderLine.calcBill({
        user,
        addressId,
        ghnServerTypeId,
      });

      return {
        data: {
          bill,
          cart,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createOrderWithCart(
    user: AuthUser,
    createOrderWithCartBodyDto: CreateOrderWithCartBodyDto,
  ) {
    try {
      const { addressId, phone, paymentMethod, ghnServerTypeId } =
        createOrderWithCartBodyDto;

      const { order } = await this.orderLine.createOrderWithCart({
        user,
        addressId,
        phone,
        paymentMethod,
        ghnServerTypeId,
      });

      return {
        message: 'Create order successfully',
        data: order,
      };
    } catch (err) {
      throw err;
    }
  }
}
