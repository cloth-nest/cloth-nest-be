import {
  IsNotEmpty,
  IsInt,
  Min,
  IsNumberString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PriceRange, ProductOrderDirection } from '../../../shared/enums';

export class GetAllProductsBelongToCategoryQueryDTO {
  @IsOptional()
  @IsEnum(PriceRange, {
    message:
      'PriceRange must be one of the following values: LT10, GTE10_LT20, GTE20_LT30, GTE30_LT50, GTE50, ALL',
  })
  priceRange: PriceRange = PriceRange.ALL;

  @IsOptional()
  @IsArray()
  @Transform((item) => item.value.split(',').map((v: string) => parseInt(v)))
  @IsInt({ each: true })
  prodTypeIdList?: number[];

  @IsOptional()
  @IsArray()
  @Transform((item) => item.value.split(',').map((v: string) => parseInt(v)))
  @IsInt({ each: true })
  sizeIdList?: number[];

  @IsOptional()
  @IsArray()
  @Transform((item) => item.value.split(',').map((v: string) => parseInt(v)))
  @IsInt({ each: true })
  colorIdList?: number[];

  @IsOptional()
  @IsEnum(ProductOrderDirection, {
    message:
      'OrderDirection must be one of the following values: LATEST, PRICE_ASC, PRICE_DESC',
  })
  orderDirection: ProductOrderDirection = ProductOrderDirection.LATEST;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limit: number;
}

export class GetAllProductsBelongToCategoryParamDto {
  @IsNumberString()
  id: string;
}
