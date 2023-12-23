import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Permission } from '../../shared/enums';
import { Auth } from '../../shared/decorators';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllWarehouse() {
    return this.warehouseService.getAllWarehouse();
  }
}
