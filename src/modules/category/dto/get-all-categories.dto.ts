import { IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class GetAllCategoriesQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  level: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limit: number;
}
