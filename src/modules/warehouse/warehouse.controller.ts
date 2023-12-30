import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Permission } from '../../shared/enums';
import { Auth } from '../../shared/decorators';
import { CreateWarehouseBodyDTO } from './dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllWarehouse() {
    return this.warehouseService.getAllWarehouse();
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createWarehouse(@Body() createWarehouseBodyDTO: CreateWarehouseBodyDTO) {
    return this.warehouseService.createWarehouse(createWarehouseBodyDTO);
  }
}
