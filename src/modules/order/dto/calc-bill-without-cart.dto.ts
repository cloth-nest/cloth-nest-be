import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';

class CartItem {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  variantId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CalcBillWithoutCartBodyDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  addressId: number;

  @IsNotEmpty()
  @IsInt()
  @IsIn([2, 5])
  ghnServerTypeId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  carts: CartItem[];
}
