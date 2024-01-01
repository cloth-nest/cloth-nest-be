import { Order } from '../../entities';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CurrencyUtil } from '../../shared/utils';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { OrderPaymentStatus } from 'src/shared/enums';

export interface ZaloPayCreateOrderResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  zp_trans_token: string;
  order_url: string;
  order_token: string;
}

export interface ZaloPayHmacInput {
  appId: string;
  appTransId: string;
  appUser: string;
  amount: number;
  appTime: number;
  embedData: string;
  item: string;
}

export interface PaymentStrategy {
  pay(order: Order): Promise<any>;
}

// Cash strategy
export class CashStrategy implements PaymentStrategy {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async pay(order: Order): Promise<any> {
    // Update order payment status
    await this.dataSource.getRepository(Order).update(order.id, {
      paymentStatus: OrderPaymentStatus.PAID,
    });

    return {
      method: 'CASH',
      orderId: order.id,
    };
  }
}

// ZaloPay strategy
export class ZaloPayStrategy implements PaymentStrategy {
  private configService: ConfigService;
  private httpService: HttpService;
  private dataSource: DataSource;

  constructor(
    configService: ConfigService,
    httpService: HttpService,
    dataSource: DataSource,
  ) {
    this.configService = configService;
    this.httpService = httpService;
    this.dataSource = dataSource;
  }

  public async pay(order: Order): Promise<any> {
    // Get env
    const ZALOPAY_BASE_URL = this.configService.get<string>('ZALOPAY_BASE_URL');
    const ZALOPAY_APP_ID = this.configService.get<string>('ZALOPAY_APP_ID');
    const ZALOPAY_KEY1 = this.configService.get<string>('ZALOPAY_KEY1');
    const ZALOPAY_CALLBACK_URL = this.configService.get<string>(
      'ZALOPAY_CALLBACK_URL',
    );

    // Make request to ZaloPayServer
    const appTransId = this.createTransId();
    const appUser = this.createAppUser(order);
    const amount = CurrencyUtil.converUSDToVND(order.total);
    const appTime = this.createAppTime();
    const embedData = `{"redirecturl": "${ZALOPAY_CALLBACK_URL}"}`;
    const item = '[]';
    const bankCode = 'zalopayapp';
    const mac = this.createMacZaloPay(
      'sha256',
      ZALOPAY_KEY1,
      this.createHmacInput({
        appId: ZALOPAY_APP_ID.toString(),
        appTransId,
        appUser,
        amount,
        appTime,
        embedData,
        item,
      }),
    );

    const body = {
      app_id: parseInt(ZALOPAY_APP_ID),
      app_user: appUser,
      app_trans_id: appTransId,
      app_time: appTime,
      amount: amount,
      item: item,
      description: 'Thanh toán đơn hàng Clothnest',
      embed_data: embedData,
      bank_code: bankCode,
      mac: mac,
      callback_url: ZALOPAY_CALLBACK_URL,
    };

    const result = await firstValueFrom(
      this.httpService.post<ZaloPayCreateOrderResponse>(
        `${ZALOPAY_BASE_URL}/create`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    // Save appTransId to order
    await this.dataSource.getRepository(Order).update(order.id, {
      apptransid: appTransId,
    });

    return {
      method: 'ZALO_PAY',
      ...result.data,
    };
  }

  private createTransId() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = now.getMonth() + 1;
    const date = now.getDate();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const miliseconds = now.getMilliseconds();

    return `${year}${month >= 10 ? month : `0${month}`}${
      date >= 10 ? date : `0${date}`
    }_${hours}${minutes}${seconds}${miliseconds}`;
  }

  private createAppTime() {
    return new Date().getTime();
  }

  private createAppUser(order: Order) {
    return `user_${order.userId}`;
  }

  private createHmacInput(zaloPayHmacInput: ZaloPayHmacInput) {
    const { appId, appTransId, appUser, amount, appTime, embedData, item } =
      zaloPayHmacInput;

    return `${appId}|${appTransId}|${appUser}|${amount}|${appTime}|${embedData}|${item}`;
  }

  private createMacZaloPay(
    hmacAlgorihtm: string = 'sha256',
    key1: string,
    hmacInput: string,
  ) {
    const macData = crypto
      .createHmac(hmacAlgorihtm, key1)
      .update(hmacInput)
      .digest('hex');

    return macData;
  }
}

// Context
export class PaymentContext {
  private paymentStrategy: PaymentStrategy;

  constructor(paymentStrategy: PaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  public setPaymentStrategy(paymentStrategy: PaymentStrategy): void {
    this.paymentStrategy = paymentStrategy;
  }

  public async pay(order: Order): Promise<void> {
    return await this.paymentStrategy.pay(order);
  }
}
