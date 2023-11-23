import { IsNotEmpty, IsInt, Min, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllAttributeValuesQueryDTO {
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

export class GetAllAttributeValuesParamDto {
  @IsNumberString()
  id: string;
}
