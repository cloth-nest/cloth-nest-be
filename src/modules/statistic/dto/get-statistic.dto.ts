import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

enum StatisticType {
  OVERVIEW = 'OVERVIEW',
  DETAIL = 'DETAIL',
}

export class GetStatisticBodyDTO {
  @IsNotEmpty()
  @IsEnum(StatisticType, {
    message:
      'StatisticType must be one of the following values: OVERVIEW, DETAIL',
  })
  @IsString()
  statisticType: StatisticType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
