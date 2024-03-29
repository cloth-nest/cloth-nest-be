import {
  OrderDeliveryMethod,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '../../shared/enums';
import {
  Address,
  Cart,
  Order,
  OrderDetail,
  ProductVariant,
  UserAddress,
  WarehouseStock,
} from '../../entities';
import { ERRORS } from '../../shared/constants';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { DataSource, In } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CurrencyUtil } from '../../shared/utils/currency.util';
import * as _ from 'lodash';

export interface IBillItemInfo {
  id: number;
  quantity: number;
  price: number;
}

export interface IBillInfo {
  total: number;
  shippingFee: number;
  totalBeforeVAT: number;
  totalAfterVAT: number;
  vatFee: number;
  items: IBillItemInfo[];
}

export interface IOrderLineError {
  line: string;
  detail: string;
}

export interface IOrderLineRequest {
  user: AuthUser;
  addressId?: number;
  address?: Address;
  phone?: string;
  variantId?: number;
  quantity?: number;
  paymentMethod?: OrderPaymentMethod;
  deliveryMethod?: OrderDeliveryMethod;
  cart?: Partial<Cart>[];
  warehouseStock?: WarehouseStock[];
  ghnServerTypeId?: number;
  bill?: IBillInfo;
  order?: Order;
  errors?: IOrderLineError[];
}

export interface IOrderLineHandler {
  setNext(handler: IOrderLineHandler): IOrderLineHandler;
  handle(orderLine: IOrderLineRequest, dataSource: DataSource): any;
}

export abstract class OrderLineHandler implements IOrderLineHandler {
  private next: IOrderLineHandler;
  protected isEmitError: boolean = true;

  public setNext(handler: IOrderLineHandler): IOrderLineHandler {
    this.next = handler;
    return handler;
  }

  public async handle(request: IOrderLineRequest, dataSource: DataSource) {
    await this.LineHandler(request, dataSource);
    if (this.next) {
      return await this.next.handle(request, dataSource);
    }
    return request;
  }

  protected abstract LineHandler(request: any, dataSource: DataSource): any;
}

export class CheckCartHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    const cart = await dataSource.getRepository(Cart).find({
      where: {
        userId: request.user.id,
      },
      select: ['id', 'quantity', 'productVariantId'],
    });

    // Assign cart prop to request
    request.cart = cart;

    request.errors = [];
    if (cart.length === 0) {
      throw new CustomErrorException(ERRORS.CartEmpty);
    }
  }
}

export class CheckInventoryHandler extends OrderLineHandler {
  constructor(isEmitError?: boolean) {
    super();
    this.isEmitError = isEmitError;
  }

  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    if (request.variantId) {
      // Get cart direct buy
      request.cart = [
        {
          productVariantId: request.variantId,
          quantity: request.quantity,
        },
      ];
    }

    // Get cart from user
    const cart = request.cart;

    // Get warehouse from product variant
    const productInventory = await dataSource
      .getRepository(WarehouseStock)
      .find({
        where: {
          variantId: In(cart.map((item) => item.productVariantId)),
          // Central warehouse
          warehouseId: 9,
        },
        select: ['id', 'variantId', 'warehouseId', 'quantity'],
      });

    // Assign warehouseStock prop to request
    request.warehouseStock = productInventory;

    // Check inventory
    const checkInventory = cart.every(
      (item) =>
        item.quantity <=
        productInventory.find(
          (product) => product.variantId === item.productVariantId,
        ).quantity,
    );

    if (!checkInventory) {
      if (this.isEmitError) {
        throw new CustomErrorException(ERRORS.InventoryNotEnough);
      }

      request.errors.push({
        line: 'CheckInventoryHandler',
        detail: 'Inventory not enough',
      });
    }
  }
}

export class CheckAddressHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    const userAddress = await dataSource.getRepository(UserAddress).findOne({
      where: {
        addressId: request.addressId,
        userId: request.user.id,
      },
    });

    if (!userAddress) {
      throw new CustomErrorException(ERRORS.AddressNotExist);
    }

    const address = await dataSource.getRepository(Address).findOne({
      where: {
        id: request.addressId,
      },
    });

    // Assign address prop to request
    request.address = address;
  }
}

// This stage calculate total of order (include VAT + shipping fee)
export class CalculateTotalHandler extends OrderLineHandler {
  private readonly httpService: HttpService;
  private readonly configService: ConfigService;

  constructor(httpService: HttpService, configService: ConfigService) {
    super();
    this.httpService = httpService;
    this.configService = configService;
  }

  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    // Check request.cart is undefined
    if (!request.cart) {
      throw new CustomErrorException(ERRORS.CartEmpty);
    }

    const productCart = await dataSource.getRepository(ProductVariant).find({
      where: {
        id: In(request.cart.map((item) => item.productVariantId)),
      },
      select: ['id', 'price', 'weight'],
    });

    // Calculate total bill before VAT
    const total = request.cart.reduce((acc: number, item) => {
      const product = productCart.find(
        (product) => product.id === item.productVariantId,
      );
      return acc + product.price * item.quantity;
    }, 0);

    // Calculate total bill after VAT (VAT = 8%)
    const totalAfterVAT = total * 1.08;

    const totalWeight = _.sumBy(productCart, 'weight');

    // Calculate shipping fee
    const shippingFee = await firstValueFrom(
      this.httpService
        .get(
          `${this.configService.get<string>(
            'GHN_BASE_URL',
          )}/shipping-order/fee`,
          {
            headers: {
              token: this.configService.get<string>('GHN_TOKEN'),
              shop_id: this.configService.get<string>('GHN_SHOP_ID'),
            },
            params: {
              to_ward_code: request.address.wardCode,
              to_district_id: request.address.districtCode,
              service_type_id: request.ghnServerTypeId,
              // Sum weight of all product in cart
              weight: totalWeight > 200 ? totalWeight : 200,
            },
          },
        )
        .pipe(
          catchError((er) => {
            console.log(er);
            throw new CustomErrorException(ERRORS.GHNThirdPartyError);
          }),
        ),
    );

    // Convert VND to USD
    const shippingFeeUSD = CurrencyUtil.converVNDToUSD(
      shippingFee.data.data.total,
    );

    // Calculate total bill
    const totalBill = totalAfterVAT + shippingFeeUSD;

    const billInfo: IBillInfo = {
      total: +totalBill.toFixed(3),
      shippingFee: +shippingFeeUSD.toFixed(3),
      totalBeforeVAT: +total.toFixed(3),
      totalAfterVAT: +totalAfterVAT.toFixed(3),
      vatFee: +(totalAfterVAT - total).toFixed(3),
      items: request.cart.map((item) => ({
        id: item.productVariantId,
        quantity: item.quantity,
        price: +(
          productCart.find((product) => product.id === item.productVariantId)
            .price * 1.1
        ).toFixed(3),
      })),
    };

    // Assign billInfo prop to request
    request.bill = billInfo;
  }
}

export class CreateOrderWithCartHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check request.bill is undefined
      if (!request.bill) {
        throw new CustomErrorException(ERRORS.BillInfoNotExist);
      }

      // Check request.addressId is undefined
      if (!request.addressId) {
        throw new CustomErrorException(ERRORS.AddressNotExist);
      }

      // Check request.phone is undefined
      if (!request.phone) {
        throw new CustomErrorException(ERRORS.OrderPhoneNotExist);
      }

      // Check request.paymentMethod is undefined
      if (!request.paymentMethod) {
        throw new CustomErrorException(ERRORS.PaymentMethodNotExist);
      }

      // Check request.cart is undefined
      if (!request.cart) {
        throw new CustomErrorException(ERRORS.CartEmpty);
      }

      // Check request.ghnServerTypeId is undefined
      if (!request.ghnServerTypeId) {
        throw new CustomErrorException(ERRORS.DeliveryMethodNotExist);
      }
      if (request.ghnServerTypeId !== 2 && request.ghnServerTypeId !== 5) {
        throw new CustomErrorException(ERRORS.DeliveryMethodNotExist);
      }
      const deliveryMethod =
        request.ghnServerTypeId === 2
          ? OrderDeliveryMethod.FAST
          : OrderDeliveryMethod.NORMAL;

      const deliveryDate =
        request.ghnServerTypeId === 2
          ? // 2 days from current date
            new Date(new Date().setDate(new Date().getDate() + 2))
          : // else 5 days from current date
            new Date(new Date().setDate(new Date().getDate() + 5));

      // Create order
      const order = await queryRunner.manager.save(Order, {
        userId: request.user.id,
        addressId: request.addressId,
        phone: request.phone,
        paymentMethod: request.paymentMethod,
        total: request.bill.total,
        shippingFee: request.bill.shippingFee,
        status:
          request.paymentMethod === OrderPaymentMethod.CASH
            ? OrderStatus.ON_PROCESS
            : OrderStatus.WAIT_FOR_PAYMENT,
        deliveryMethod,
        paymentStatus: OrderPaymentStatus.UNPAID,
        deliveryDate,
      });

      // Create order detail
      const orderDetail = request.cart.map((item) =>
        dataSource.getRepository(OrderDetail).create({
          orderId: order.id,
          variantId: item.productVariantId,
          quantity: item.quantity,
          price: request.bill.items.find(
            (product) => product.id === item.productVariantId,
          ).price,
        }),
      );

      await queryRunner.manager.save(OrderDetail, orderDetail);

      // Delete cart
      await dataSource.manager.delete(Cart, {
        userId: request.user.id,
      });

      // Deduct inventory
      await Promise.all(
        request.cart.map((item) =>
          queryRunner.manager.decrement(
            WarehouseStock,
            {
              variantId: item.productVariantId,
              warehouseId: 9,
            },
            'quantity',
            item.quantity,
          ),
        ),
      );

      // Assign order prop to request
      request.order = order;
      request.order.orderDetails = orderDetail;

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export class CreateOrderWithoutCartHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check request.bill is undefined
      if (!request.bill) {
        throw new CustomErrorException(ERRORS.BillInfoNotExist);
      }

      // Check request.addressId is undefined
      if (!request.addressId) {
        throw new CustomErrorException(ERRORS.AddressNotExist);
      }

      // Check request.phone is undefined
      if (!request.phone) {
        throw new CustomErrorException(ERRORS.OrderPhoneNotExist);
      }

      // Check request.paymentMethod is undefined
      if (!request.paymentMethod) {
        throw new CustomErrorException(ERRORS.PaymentMethodNotExist);
      }

      // Check request.quantity is undefined
      if (!request.quantity) {
        throw new CustomErrorException(ERRORS.MissFieldQuantity);
      }

      // Check request.ghnServerTypeId is undefined
      if (!request.ghnServerTypeId) {
        throw new CustomErrorException(ERRORS.DeliveryMethodNotExist);
      }
      if (request.ghnServerTypeId !== 2 && request.ghnServerTypeId !== 5) {
        throw new CustomErrorException(ERRORS.DeliveryMethodNotExist);
      }
      const deliveryMethod =
        request.ghnServerTypeId === 2
          ? OrderDeliveryMethod.FAST
          : OrderDeliveryMethod.NORMAL;

      const deliveryDate =
        request.ghnServerTypeId === 2
          ? // 2 days from current date
            new Date(new Date().setDate(new Date().getDate() + 2))
          : // else 5 days from current date
            new Date(new Date().setDate(new Date().getDate() + 5));

      // Create order
      const order = await queryRunner.manager.save(Order, {
        userId: request.user.id,
        addressId: request.addressId,
        phone: request.phone,
        paymentMethod: request.paymentMethod,
        total: request.bill.total,
        shippingFee: request.bill.shippingFee,
        status:
          request.paymentMethod === OrderPaymentMethod.CASH
            ? OrderStatus.ON_PROCESS
            : OrderStatus.WAIT_FOR_PAYMENT,
        deliveryMethod,
        paymentStatus: OrderPaymentStatus.UNPAID,
        deliveryDate,
      });

      // Create order detail
      const orderDetail = await queryRunner.manager.save(OrderDetail, {
        orderId: order.id,
        variantId: request.variantId,
        quantity: request.quantity,
        price: request.bill.items.find(
          (product) => product.id === request.variantId,
        ).price,
      });

      // Deduct inventory
      await queryRunner.manager.decrement(
        WarehouseStock,
        {
          variantId: request.variantId,
          warehouseId: 9,
        },
        'quantity',
        request.quantity,
      );

      // Assign order prop to request
      request.order = order;
      request.order.orderDetails = [orderDetail];

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

@Injectable()
export class OrderLine {
  constructor(
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async checkInventory(
    request: IOrderLineRequest,
  ): Promise<IOrderLineRequest> {
    const checkCartHandler = new CheckCartHandler();
    const checkInventoryHandler = new CheckInventoryHandler();

    checkCartHandler.setNext(checkInventoryHandler);

    return checkCartHandler.handle(request, this.dataSource);
  }

  public async calcBill(
    request: IOrderLineRequest,
  ): Promise<IOrderLineRequest> {
    const checkCartHandler = new CheckCartHandler();
    const checkInventoryHandler = new CheckInventoryHandler();
    const checkAddressHandler = new CheckAddressHandler();
    const calculateTotalHandler = new CalculateTotalHandler(
      this.httpService,
      this.configService,
    );

    checkCartHandler.setNext(checkInventoryHandler);
    checkInventoryHandler.setNext(checkAddressHandler);
    checkAddressHandler.setNext(calculateTotalHandler);

    return checkCartHandler.handle(request, this.dataSource);
  }

  public async calcBillWithoutCart(
    request: IOrderLineRequest,
  ): Promise<IOrderLineRequest> {
    const checkInventoryHandler = new CheckInventoryHandler();
    const checkAddressHandler = new CheckAddressHandler();
    const calculateTotalHandler = new CalculateTotalHandler(
      this.httpService,
      this.configService,
    );

    checkInventoryHandler.setNext(checkAddressHandler);
    checkAddressHandler.setNext(calculateTotalHandler);

    return checkInventoryHandler.handle(request, this.dataSource);
  }

  public async createOrderWithCart(
    request: IOrderLineRequest,
  ): Promise<IOrderLineRequest> {
    const checkCartHandler = new CheckCartHandler();
    const checkInventoryHandler = new CheckInventoryHandler();
    const checkAddressHandler = new CheckAddressHandler();
    const calculateTotalHandler = new CalculateTotalHandler(
      this.httpService,
      this.configService,
    );
    const createOrderWithCartHandler = new CreateOrderWithCartHandler();

    checkCartHandler.setNext(checkInventoryHandler);
    checkInventoryHandler.setNext(checkAddressHandler);
    checkAddressHandler.setNext(calculateTotalHandler);
    calculateTotalHandler.setNext(createOrderWithCartHandler);

    return checkCartHandler.handle(request, this.dataSource);
  }

  public async createOrderWithoutCart(
    request: IOrderLineRequest,
  ): Promise<IOrderLineRequest> {
    const checkInventoryHandler = new CheckInventoryHandler();
    const checkAddressHandler = new CheckAddressHandler();
    const calculateTotalHandler = new CalculateTotalHandler(
      this.httpService,
      this.configService,
    );
    const createOrderWithoutCartHandler = new CreateOrderWithoutCartHandler();

    checkInventoryHandler.setNext(checkAddressHandler);
    checkAddressHandler.setNext(calculateTotalHandler);
    calculateTotalHandler.setNext(createOrderWithoutCartHandler);

    return checkInventoryHandler.handle(request, this.dataSource);
  }
}
