import { IsNumberString } from 'class-validator';

export class GetOrderDetailParamDto {
  @IsNumberString()
  id: string;
}
