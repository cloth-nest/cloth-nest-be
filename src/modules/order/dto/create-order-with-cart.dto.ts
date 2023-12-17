import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Length,
  IsEnum,
} from 'class-validator';
import { OrderPaymentMethod } from '../../../shared/enums';

export class CreateOrderWithCartBodyDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  addressId: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  phone: string;

  @IsNotEmpty()
  @IsEnum(OrderPaymentMethod, {
    message:
      'PaymentMethod must be one of the following values: COD, MOMO, ZALOPAY',
  })
  paymentMethod: OrderPaymentMethod;
}
