import {
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class ImportOrderBodyDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  warehouseId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  carts: CartItem[];
}
