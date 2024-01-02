import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../entities';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import {
  CashStrategy,
  PaymentContext,
  ZaloPayStrategy,
} from './payment.strategy';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '../../shared/enums';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @Inject('PaymentContext')
    private readonly paymentContext: PaymentContext,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
  ) {}
  public async makePayment(orderId: string) {
    try {
      const order = await this.orderRepo.findOne({
        where: {
          id: parseInt(orderId),
        },
        relations: ['orderDetails'],
      });

      if (!order) {
        throw new CustomErrorException(ERRORS.OrderNotExist);
      }

      // Check order payment status
      if (order.paymentStatus === OrderPaymentStatus.PAID) {
        throw new CustomErrorException(ERRORS.OrderAlreadyPaid);
      }

      if (order.paymentMethod === OrderPaymentMethod.CASH) {
        this.paymentContext.setPaymentStrategy(
          new CashStrategy(this.dataSource),
        );
      }

      if (order.paymentMethod === OrderPaymentMethod.ZALO_PAY) {
        this.paymentContext.setPaymentStrategy(
          new ZaloPayStrategy(
            this.configService,
            this.httpService,
            this.dataSource,
          ),
        );
      }

      const paymentResult = await this.paymentContext.pay(order);

      return {
        message: 'Payment success',
        data: {
          paymentResult,
          order,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async confirmOrderPaymentSuccess(apptransid: string) {
    // Check paymnent status must not be UNPAID
    const order = await this.orderRepo.findOne({
      where: {
        apptransid,
      },
    });
    if (order.paymentStatus !== OrderPaymentStatus.UNPAID) {
      throw new CustomErrorException(ERRORS.OrderAlreadyPaid);
    }

    const APP_ID = this.configService.get<string>('ZALOPAY_APP_ID');

    const mac = this.createMacZaloPay(
      'sha256',
      this.configService.get<string>('ZALOPAY_KEY1'),
      this.createHmacInput({
        appId: APP_ID,
        appTransId: apptransid,
      }),
    );

    const statusZaloPayment = await this.getStatusZaloPayment(
      APP_ID,
      apptransid,
      mac,
    );

    if (statusZaloPayment.return_code !== 1) {
      throw new CustomErrorException(ERRORS.ZaloPayPaymentFailed);
    }

    // Update order payment status
    await this.orderRepo.update(
      {
        apptransid,
      },
      {
        status: OrderStatus.ON_PROCESS,
        paymentStatus: OrderPaymentStatus.PAID,
      },
    );

    return {
      message: 'Payment successfully',
      data: statusZaloPayment,
    };
  }

  private createHmacInput(zaloPayHmacInput: any) {
    const { appId, appTransId } = zaloPayHmacInput;
    const key1 = this.configService.get<string>('ZALOPAY_KEY1');

    return `${appId}|${appTransId}|${key1}`;
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

  private async getStatusZaloPayment(
    appId: string,
    appTransId: string,
    mac: string,
  ) {
    const body = {
      app_id: parseInt(appId),
      app_trans_id: appTransId,
      mac,
    };

    return (
      await firstValueFrom(
        this.httpService.post('https://sb-openapi.zalopay.vn/v2/query', body),
      )
    ).data;
  }
}
