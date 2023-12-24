import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';

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

export class UpdateProductParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateProductBodyDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId: number;

  @IsOptional()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes: ProductAttribute[];

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
