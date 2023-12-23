import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  Length,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllProductsQueryDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  search: string;

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
