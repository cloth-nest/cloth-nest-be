import { IsNumberString } from 'class-validator';

export class DeleteWarehouseParamDto {
  @IsNumberString()
  id: string;
}
