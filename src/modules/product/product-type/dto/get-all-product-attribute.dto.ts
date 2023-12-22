import { IsNumberString } from 'class-validator';

export class GetAllProductAttributesParamDto {
  @IsNumberString()
  id: string;
}
