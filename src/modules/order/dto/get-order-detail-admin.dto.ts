import { IsNumberString } from 'class-validator';

export class GetOrderDetailAdminParamDto {
  @IsNumberString()
  id: string;
}
