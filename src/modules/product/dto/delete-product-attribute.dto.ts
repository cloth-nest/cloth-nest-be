import { IsNumberString } from 'class-validator';

export class DeleteProductAttributeParamDto {
  @IsNumberString()
  id: string;
}
