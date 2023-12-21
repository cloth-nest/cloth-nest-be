import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOrderPaymentSuccessQueryDto {
  @IsNotEmpty()
  @IsString()
  apptransid: string;
}
