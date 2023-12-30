import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  ProductVariant,
  User,
  Warehouse,
  WarehouseStock,
} from '../../entities';
import { DataSource, In, Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import {
  CalcBillBodyDto,
  CreateOrderWithCartBodyDto,
  CreateOrderWithoutCartBodyDto,
  GetAllOrdersBelongToUserQueryDTO,
  GetAllOrdersQueryDTO,
  ImportOrderBodyDTO,
  UpdateOrderStatusBodyDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { OrderLine } from './order-line.service';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '../../shared/enums';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(WarehouseStock)
    private warehouseStockRepo: Repository<WarehouseStock>,
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
        return quantity >= cartItem.quantity;
      });

      return {
        data: {
          isAvailable: !!errors,
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

  public async importOrder(importOrderBodyDTO: ImportOrderBodyDTO) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { userId, warehouseId, carts } = importOrderBodyDTO;

      // Check user exist
      if (userId) {
        const userExist = await this.userRepo.count({
          where: {
            id: userId,
          },
        });
        if (!userExist) {
          throw new CustomErrorException(ERRORS.UserNotExist);
        }
      }

      // Check product variant exist
      const productVariantExist = await this.productVariantRepo.count({
        where: {
          id: In(carts.map((item) => item.variantId)),
        },
      });
      if (productVariantExist !== carts.length) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      // Check warehouse exist
      const warehouseExist = await this.warehouseRepo.count({
        where: {
          id: warehouseId,
        },
      });
      if (!warehouseExist) {
        throw new CustomErrorException(ERRORS.WarehouseNotExist);
      }

      // Get warehouse from product variant
      const productInventory = await this.warehouseStockRepo.find({
        where: {
          variantId: In(carts.map((item) => item.variantId)),
          warehouseId,
        },
      });

      if (productInventory.length === 0) {
        throw new CustomErrorException(ERRORS.InventoryNotEnough);
      }

      // Check inventory
      const checkInventory = carts.every(
        (item) =>
          item.quantity <=
          productInventory.find(
            (product) => product.variantId === item.variantId,
          ).quantity,
      );

      if (!checkInventory) {
        throw new CustomErrorException(ERRORS.InventoryNotEnough);
      }

      const productCart = await this.productVariantRepo.find({
        where: {
          id: In(carts.map((item) => item.variantId)),
        },
        select: ['id', 'price', 'weight'],
      });

      // Calculate total bill before VAT
      const total = carts.reduce((acc: number, item) => {
        const product = productCart.find(
          (product) => product.id === item.variantId,
        );
        return acc + product.price * item.quantity;
      }, 0);

      // Calculate total bill after VAT (VAT = 8%)
      const totalBill = total * 1.08;

      // Create order
      const order = await queryRunner.manager.save(Order, {
        userId,
        total: totalBill,
        status: OrderStatus.DELIVERED,
        paymentMethod: OrderPaymentMethod.CASH,
        paymentStatus: OrderPaymentStatus.PAID,
      });

      // Create order detail
      await queryRunner.manager.save(
        OrderDetail,
        carts.map((item) => ({
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: productCart.find((product) => product.id === item.variantId)
            .price,
        })),
      );

      // Deduct inventory
      await Promise.all(
        carts.map((item) =>
          queryRunner.manager.decrement(
            WarehouseStock,
            {
              variantId: item.variantId,
              warehouseId,
            },
            'quantity',
            item.quantity,
          ),
        ),
      );

      await queryRunner.commitTransaction();
      return {
        message: 'Import order successfully',
        data: {
          order,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async getOrderDetailAdmin(orderId: string) {
    try {
      const order = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.id = :id', { id: orderId })
        .leftJoinAndSelect('order.address', 'address')
        .leftJoinAndSelect('order.orderDetails', 'detail')
        .leftJoinAndSelect('detail.productVariant', 'productVariant')
        .leftJoinAndSelect('productVariant.variantImages', 'variantImages')
        .leftJoinAndSelect('variantImages.productImage', 'image')
        .leftJoinAndSelect('order.user', 'user')
        .select([
          'order.id',
          'order.userId',
          'order.addressId',
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
          'detail.id',
          'detail.quantity',
          'detail.price',
          'user.id',
          'user.firstName',
          'user.lastName',
          'productVariant.id',
          'productVariant.name',
          'productVariant.sku',
          'variantImages.id',
          'image.image',
        ])
        .getOne();

      if (!order) {
        throw new CustomErrorException(ERRORS.OrderNotExist);
      }

      return {
        data: {
          ...order,
          orderDetails: order.orderDetails.map((detail) => ({
            ...detail,
            productVariant: undefined,
            variantId: detail.productVariant.id,
            name: detail.productVariant.name,
            sku: detail.productVariant.sku,
            image: detail.productVariant.variantImages[0].productImage.image,
          })),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async updateOrderStatus(
    orderId: string,
    updateOrderStatusBodyDTO: UpdateOrderStatusBodyDTO,
  ) {
    try {
      const { orderStatus } = updateOrderStatusBodyDTO;

      const order = await this.orderRepo.findOne({
        where: {
          id: parseInt(orderId),
        },
      });

      if (!order) {
        throw new CustomErrorException(ERRORS.OrderNotExist);
      }

      if (order.status === orderStatus) {
        throw new CustomErrorException(ERRORS.OrderAlreadyUpdated);
      }

      await this.orderRepo.update(
        {
          id: parseInt(orderId),
        },
        {
          status: orderStatus,
        },
      );

      return {
        message: 'Update order status successfully',
      };
    } catch (err) {
      throw err;
    }
  }
}
