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
  CreateOrderWithoutCartBodyDto,
  GetAllOrdersBelongToUserQueryDTO,
  GetAllOrdersQueryDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { OrderLine } from './order-line.service';
import { OrderPaymentStatus, OrderStatus } from '../../shared/enums';

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
          'order.deliveryDate',
          'order.shippingFee',
          'order.phone',
          'order.deliveryMethod',
          'order.paymentMethod',
          'order.paymentStatus',
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
          'order.deliveryDate',
          'order.shippingFee',
          'order.phone',
          'order.deliveryMethod',
          'order.paymentMethod',
          'order.paymentStatus',
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

      const { order, bill } = await this.orderLine.createOrderWithCart({
        user,
        addressId,
        phone,
        paymentMethod,
        ghnServerTypeId,
      });

      return {
        message: 'Create order successfully',
        data: {
          order,
          bill,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createOrderWithoutCart(
    user: AuthUser,
    createOrderWithoutCartBodyDto: CreateOrderWithoutCartBodyDto,
  ) {
    try {
      const {
        addressId,
        phone,
        paymentMethod,
        ghnServerTypeId,
        variantId,
        quantity,
      } = createOrderWithoutCartBodyDto;

      const { order, bill } = await this.orderLine.createOrderWithoutCart({
        user,
        addressId,
        phone,
        paymentMethod,
        ghnServerTypeId,
        variantId,
        quantity,
      });

      return {
        message: 'Create order successfully',
        data: {
          order,
          bill,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async cancelOrder(user: AuthUser, orderId: string) {
    try {
      const order = await this.orderRepo.findOne({
        where: {
          id: parseInt(orderId),
          userId: user.id,
        },
      });

      if (!order) {
        throw new CustomErrorException(ERRORS.OrderNotExist);
      }

      if (order.status === OrderStatus.CANCELED) {
        throw new CustomErrorException(ERRORS.OrderAlreadyCanceled);
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new CustomErrorException(ERRORS.OrderAlreadyDelivered);
      }

      if (order.paymentStatus === OrderPaymentStatus.PAID) {
        throw new CustomErrorException(ERRORS.OrderAlreadyPaid);
      }

      await this.orderRepo.update(
        {
          id: parseInt(orderId),
        },
        {
          status: OrderStatus.CANCELED,
        },
      );

      return {
        message: 'Cancel order successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllOrder(getAllOrderQueryDTO: GetAllOrdersQueryDTO) {
    try {
      const { page, limit } = getAllOrderQueryDTO;

      const [orders, total] = await this.orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .select([
          'order.id',
          'order.total',
          'order.status',
          'order.total',
          'order.deliveryMethod',
          'order.paymentMethod',
          'order.paymentStatus',
          'order.createdAt',
          'user.firstName',
          'user.lastName',
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
}
