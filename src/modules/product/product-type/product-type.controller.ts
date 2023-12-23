import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../../../shared/decorators';
import { Permission } from '../../../shared/enums';
import { ProductTypeService } from './product-type.service';
import {
  GetAllProductTypeQueryDTO,
  GetAllProductAttributesParamDto,
  CreateProductTypeBodyDTO,
  AddAttributeBodyDTO,
} from './dto';

@Controller('product/type')
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
  ) {
    return this.productTypeService.getAllAttributeBelongToProductType(param.id);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createProductType(
    @Body() createProductTypeBodyDTO: CreateProductTypeBodyDTO,
  ) {
    return this.productTypeService.createProductType(createProductTypeBodyDTO);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('/attribute')
  @HttpCode(HttpStatus.CREATED)
  addAttributes(@Body() addAttributeBodyDTO: AddAttributeBodyDTO) {
    return this.productTypeService.addAttributes(addAttributeBodyDTO);
  }
}
