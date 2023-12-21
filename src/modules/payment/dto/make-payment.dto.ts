import { IsNumberString } from 'class-validator';

export class MakePaymentParamDto {
  @IsNumberString()
  id: string;
}
