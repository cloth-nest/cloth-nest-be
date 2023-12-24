import { IsNumberString } from 'class-validator';

export class GetAllVariantAttributeBelongToProductParamDTO {
  @IsNumberString()
  id: string;
}
