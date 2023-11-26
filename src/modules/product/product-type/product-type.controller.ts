import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { Auth } from '../../../shared/decorators';
import { Permission } from '../../../shared/enums';
import { ProductTypeService } from './product-type.service';
import {
  GetAllProductAttributesQueryDTO,
  GetAllProductTypeQueryDTO,
  GetAllProductAttributesParamDto,
} from './dto';

@Controller('product/types')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllProductTypes(
    @Query() getAllProductTypeQueryDTO: GetAllProductTypeQueryDTO,
  ) {
    return this.productTypeService.getAllProductTypes(
      getAllProductTypeQueryDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAllAttributeBelongToProductType(
    @Param() param: GetAllProductAttributesParamDto,
    @Query() getAllProductAttributesQueryDTO: GetAllProductAttributesQueryDTO,
  ) {
    return this.productTypeService.getAllAttributeBelongToProductType(
      param.id,
      getAllProductAttributesQueryDTO,
    );
  }
}
