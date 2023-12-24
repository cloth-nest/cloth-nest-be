import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BulkCreateImageBodyDTO {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productId: number;
}
