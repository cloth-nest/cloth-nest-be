import { IsNumberString } from 'class-validator';

export class GetProductDetailAdminParamDTO {
  @IsNumberString()
  id: string;
}
