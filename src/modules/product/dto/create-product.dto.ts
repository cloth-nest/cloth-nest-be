import { Type } from 'class-transformer';
import {
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

export class CreateProductBodyDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes: ProductAttribute[];
}
