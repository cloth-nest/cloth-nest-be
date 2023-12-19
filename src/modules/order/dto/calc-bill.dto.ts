import { IsNotEmpty, IsInt, Min, IsIn } from 'class-validator';

export class CalcBillBodyDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  addressId: number;

  @IsNotEmpty()
  @IsInt()
  @IsIn([2, 5])
  ghnServerTypeId: number;
}
