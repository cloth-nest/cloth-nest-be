import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateProductAttributeParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateProductAttributeBodyDTO {
  @IsNotEmpty()
  @IsString()
  productAttributeName: string;
}
