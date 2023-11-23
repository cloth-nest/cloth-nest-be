import { IsNumberString } from 'class-validator';

export class DeleteAttributeValueParamDto {
  @IsNumberString()
  id: string;
}
