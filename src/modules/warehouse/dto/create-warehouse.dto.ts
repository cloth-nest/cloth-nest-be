import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseBodyDTO {
  @IsNotEmpty()
  @IsString()
  warehouseName: string;
}
