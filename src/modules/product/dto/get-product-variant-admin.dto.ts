import { IsNumberString } from 'class-validator';

export class GetProductVariantAdminParamDTO {
  @IsNumberString()
  id: string;
}
