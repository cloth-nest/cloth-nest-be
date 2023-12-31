import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumberString, Min } from 'class-validator';

export class GetProductRecommendationParamDTO {
  @IsNumberString()
  id: string;
}

export class GetProductRecommendationQueryDTO {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  count: number;
}
