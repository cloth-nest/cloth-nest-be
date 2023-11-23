import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductAttributeBodyDTO {
  @IsNotEmpty()
  @IsString()
  productAttributeName: string;
}
