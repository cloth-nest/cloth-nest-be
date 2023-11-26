import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductTypeBodyDTO {
  @IsNotEmpty()
  @IsString()
  productTypeName: string;
}
