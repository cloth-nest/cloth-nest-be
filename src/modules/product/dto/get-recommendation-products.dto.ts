import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumberString, Min } from 'class-validator';

export class GetRecommendationProductsParamDto {
  @IsNumberString()
  id: string;
}

export class GetRecommendationProductsQueryDTO {
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
