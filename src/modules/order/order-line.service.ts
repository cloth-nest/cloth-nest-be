import { OrderPaymentMethod } from '../../shared/enums';
import {
  Cart,
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

export interface IBillInfo {
  total: number;
  shippingFee: number;
  totalBeforeVAT: number;
  totalAfterVAT: number;
  vatFee: number;
}

export interface IOrderLineRequest {
  user: AuthUser;
  addressId?: number;
  phone?: string;
  paymentMethod?: OrderPaymentMethod;
  cart?: Cart[];
  ghnServerType?: number;
  bill?: IBillInfo;
  emitError?: boolean;
}

export interface IOrderLineHandler {
  setNext(handler: IOrderLineHandler): IOrderLineHandler;
  handle(orderLine: IOrderLineRequest, dataSource: DataSource): any;
}

export abstract class OrderLineHandler implements IOrderLineHandler {
  private next: IOrderLineHandler;

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

    if (cart.length === 0) {
      throw new CustomErrorException(ERRORS.CartEmpty);
    }
  }
}

export class CheckInventoryHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    // Get cart from user
    const cart = await dataSource.getRepository(Cart).find({
      where: {
        userId: request.user.id,
      },
      select: ['id', 'quantity', 'productVariantId'],
    });

    // Get warehouse from product variant
    const productInventory = await dataSource
      .getRepository(WarehouseStock)
      .find({
        where: {
          variantId: In(cart.map((item) => item.productVariantId)),
          warehouseId: 9,
        },
      });

    // Check inventory
    const checkInventory = cart.every(
      (item) =>
        item.quantity <=
        productInventory.find(
          (product) => product.variantId === item.productVariantId,
        ).quantity,
    );

    if (!checkInventory) {
      throw new CustomErrorException(ERRORS.InventoryNotEnough);
    }
  }
}

export class CheckAddressHandler extends OrderLineHandler {
  protected async LineHandler(
    request: IOrderLineRequest,
    dataSource: DataSource,
  ): Promise<void> {
    const address = await dataSource.getRepository(UserAddress).findOne({
      where: {
        id: request.addressId,
        userId: request.user.id,
      },
    });

    if (!address) {
      throw new CustomErrorException(ERRORS.AddressNotExist);
    }
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
              to_ward_code: '1B1517',
              to_district_id: 1542,
              service_type_id: 2,
              weight: 1000,
            },
          },
        )
        .pipe(
          catchError(() => {
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
      total: totalBill,
      shippingFee: shippingFeeUSD,
      totalBeforeVAT: total,
      totalAfterVAT,
      vatFee: totalAfterVAT - total,
    };

    // Assign billInfo prop to request
    request.bill = billInfo;
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
}
