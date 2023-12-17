import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CalcBillBodyDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  addressId: number;

  @IsNotEmpty()
  @IsInt()
  ghnServerType: number;
}
