import { IsNumberString } from 'class-validator';

export class GetAllImagesBelongToProductParamDto {
  @IsNumberString()
  id: string;
}
