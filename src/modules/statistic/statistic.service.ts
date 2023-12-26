import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Order, Product, User } from '../../entities';
import { GetStatisticBodyDTO } from './dto';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import { OrderStatus } from 'src/shared/enums';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async getStatistic(getStatisticBodyDTO: GetStatisticBodyDTO) {
    try {
      // Destruct body
      const { endDate, startDate, statisticType } = getStatisticBodyDTO;

      if (statisticType === 'DETAIL') {
        if (!startDate || !endDate) {
          throw new CustomErrorException(ERRORS.StartDateEndDateRequired);
        }

        if (startDate > endDate) {
          throw new CustomErrorException(ERRORS.StartDateMustBeBeforeEndDate);
        }

        // Sum total price of all orders
        const totalRevenue = await this.orderRepo.sum('total', {
          createdAt: Between(startDate, endDate),
        });

        // Count order status is 'DELIVERED'
        const deliveredOrder = await this.orderRepo.count({
          where: {
            createdAt: Between(startDate, endDate),
            status: OrderStatus.DELIVERED,
          },
        });

        // Count order status is 'ON_PROCESS'
        const onProcessOrder = await this.orderRepo.count({
          where: {
            createdAt: Between(startDate, endDate),
            status: OrderStatus.ON_PROCESS,
          },
        });

        // Count order status is 'CANCELED'
        const canceledOrder = await this.orderRepo.count({
          where: {
            createdAt: Between(startDate, endDate),
            status: OrderStatus.CANCELED,
          },
        });

        // Count order status is 'WAIT_FOR_PAYMENT'
        const waitForPaymentOrder = await this.orderRepo.count({
          where: {
            createdAt: Between(startDate, endDate),
            status: OrderStatus.WAIT_FOR_PAYMENT,
          },
        });

        return {
          data: {
            totalRevenue,
            transaction:
              deliveredOrder +
              canceledOrder +
              waitForPaymentOrder +
              onProcessOrder,
            deliveredOrder,
            onProcessOrder,
            canceledOrder,
            waitForPaymentOrder,
          },
        };
      }

      const countedUser = await this.userRepo.count();
      const countedProduct = await this.productRepo.count();

      // Sum total price of all orders
      const totalRevenue = await this.orderRepo.sum('total');

      // Count order status is 'DELIVERED'
      const deliveredOrder = await this.orderRepo.count({
        where: {
          status: OrderStatus.DELIVERED,
        },
      });

      // Count order status is 'ON_PROCESS'
      const onProcessOrder = await this.orderRepo.count({
        where: {
          status: OrderStatus.ON_PROCESS,
        },
      });

      // Count order status is 'CANCELED'
      const canceledOrder = await this.orderRepo.count({
        where: {
          status: OrderStatus.CANCELED,
        },
      });

      // Count order status is 'WAIT_FOR_PAYMENT'
      const waitForPaymentOrder = await this.orderRepo.count({
        where: {
          status: OrderStatus.WAIT_FOR_PAYMENT,
        },
      });

      return {
        data: {
          totalRevenue,
          transaction:
            deliveredOrder +
            canceledOrder +
            waitForPaymentOrder +
            onProcessOrder,
          deliveredOrder,
          onProcessOrder,
          canceledOrder,
          waitForPaymentOrder,
          countedUser,
          countedProduct,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
