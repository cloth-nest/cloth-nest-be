import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
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
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message:
        'rating must be a number conforming to the specified constraints is 1. Eg: Use 3.7 instead of 3.71',
    },
  )
  @Min(1)
  @Max(5)
  rating: number;
}
