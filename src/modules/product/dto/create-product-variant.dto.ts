import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductAttribute {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  valueId: number;
}

class Stock {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  warehouseId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;
}

export class CreateProductVariantBodyDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productId: number;

  @IsNotEmpty()
  @IsString()
  variantName: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  imageIds: number[];

  @IsNotEmpty()
  @IsInt()
  @Min(200)
  weight: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  variantAttributes: ProductAttribute[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Stock)
  stocks: Stock[];
}
