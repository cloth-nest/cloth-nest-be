import { IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllCategoriesQueryDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  level: number;

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
