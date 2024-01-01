import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';

export class GetProductRecommendationParamDTO {
  @IsNumberString()
  id: string;
}

export class GetProductRecommendationQueryDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  count: number = 10;
}
