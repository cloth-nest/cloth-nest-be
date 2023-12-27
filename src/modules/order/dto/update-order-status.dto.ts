import { IsNotEmpty, IsEnum, IsNumberString } from 'class-validator';
import { OrderStatus } from '../../../shared/enums';

export class UpdateOrderStatusBodyDTO {
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message:
      'OrderStatus must be one of the following values: DELIVERED, ON_PROCESS, WAIT_FOR_PAYMENT, CANCELED',
  })
  orderStatus: OrderStatus;
}

export class UpdateOrderStatusParamDTO {
  @IsNumberString()
  id: string;
}
