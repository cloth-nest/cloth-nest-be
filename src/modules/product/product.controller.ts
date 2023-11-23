import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import {
  GetAllAttributeQueryDTO,
  GetAllAttributeValuesParamDto,
  GetAllAttributeValuesQueryDTO,
} from './dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('attributes')
  @HttpCode(HttpStatus.OK)
  getAllAttributes(
    @Query()
    getAllAttributesQueryDTO: GetAllAttributeQueryDTO,
  ) {
    return this.productService.getAllAttributes(getAllAttributesQueryDTO);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('attributes/:id/values')
  @HttpCode(HttpStatus.OK)
  getAllValuesBelongToAttribute(
    @Param() param: GetAllAttributeValuesParamDto,
    @Query()
    getAllAttributeValuesQueryDTO: GetAllAttributeValuesQueryDTO,
  ) {
    return this.productService.getAllAttributeValues(
      param.id,
      getAllAttributeValuesQueryDTO,
    );
  }
}
