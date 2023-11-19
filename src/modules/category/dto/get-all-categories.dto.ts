import { IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllCategoriesAdminQueryDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  level: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId: number;

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

export class GetAllCategoriesUserQueryDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  depth: number;
}
