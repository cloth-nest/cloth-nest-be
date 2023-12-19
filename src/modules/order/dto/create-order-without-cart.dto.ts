import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Length,
  IsEnum,
  IsIn,
} from 'class-validator';
import { OrderPaymentMethod } from '../../../shared/enums';

export class CreateOrderWithoutCartBodyDto {
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
      'PaymentMethod must be one of the following values: CASH, ZALO_PAY, PAYPAL',
  })
  paymentMethod: OrderPaymentMethod;

  @IsNotEmpty()
  @IsInt()
  @IsIn([2, 5])
  ghnServerTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  variantId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
