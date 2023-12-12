import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class RemoveCartItemBodyDto {
  @IsNotEmpty()
  @IsInt()
  variantId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
