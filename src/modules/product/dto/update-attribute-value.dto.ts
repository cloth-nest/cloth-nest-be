import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateAttributeValueParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateAttributeValueBodyDTO {
  @IsNotEmpty()
  @IsString()
  attributeValue: string;
}
