import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewParamDTO {
  @IsNumberString()
  id: string;
}

export class CreateReviewBodyDTO {
  @IsNotEmpty()
  @IsString()
  reviewContent: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
