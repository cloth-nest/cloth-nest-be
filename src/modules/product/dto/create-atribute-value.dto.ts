import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeValueBodyDTO {
  @IsNotEmpty()
  @IsInt()
  attributeId: number;

  @IsNotEmpty()
  @IsString()
  attributeValue: string;
}
