import { IsNumberString } from 'class-validator';

export class GetProductDetailParamDto {
  @IsNumberString()
  id: string;
}
