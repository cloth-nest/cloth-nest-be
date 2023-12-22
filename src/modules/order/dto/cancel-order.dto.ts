import { IsNumberString } from 'class-validator';

export class CancelOrderParamDto {
  @IsNumberString()
  id: string;
}
