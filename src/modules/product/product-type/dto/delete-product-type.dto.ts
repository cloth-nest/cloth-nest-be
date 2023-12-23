import { IsNumberString } from 'class-validator';

export class DeleteProductTypeParamDto {
  @IsNumberString()
  id: string;
}
