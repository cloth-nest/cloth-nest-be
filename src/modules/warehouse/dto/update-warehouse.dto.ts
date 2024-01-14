import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateWarehouseParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateWarehouseBodyDTO {
  @IsNotEmpty()
  @IsString()
  warehouseName: string;
}
