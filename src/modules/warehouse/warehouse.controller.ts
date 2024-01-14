import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Permission } from '../../shared/enums';
import { Auth } from '../../shared/decorators';
import {
  CreateWarehouseBodyDTO,
  DeleteWarehouseParamDto,
  UpdateWarehouseBodyDTO,
  UpdateWarehouseParamDto,
} from './dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllWarehouse() {
    return this.warehouseService.getAllWarehouse();
  }

  @Auth(Permission.MANAGE_WAREHOUSE)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createWarehouse(@Body() createWarehouseBodyDTO: CreateWarehouseBodyDTO) {
    return this.warehouseService.createWarehouse(createWarehouseBodyDTO);
  }

  @Auth(Permission.MANAGE_WAREHOUSE)
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  updateWarehouse(
    @Param() updateWarehouseParamDto: UpdateWarehouseParamDto,
    @Body() updateWarehouseBodyDTO: UpdateWarehouseBodyDTO,
  ) {
    return this.warehouseService.updateWarehouse(
      updateWarehouseParamDto.id,
      updateWarehouseBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_WAREHOUSE)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteWarehouse(@Param() deleteWarehouseParamDto: DeleteWarehouseParamDto) {
    return this.warehouseService.deleteWarehouse(deleteWarehouseParamDto.id);
  }
}
