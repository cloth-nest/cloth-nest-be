import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddToCartBodyDto {
  @IsNotEmpty()
  @IsInt()
  variantId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
