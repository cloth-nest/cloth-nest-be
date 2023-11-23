import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import { GetAllAttributeQueryDTO } from './dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('attributes')
  @HttpCode(HttpStatus.OK)
  getAllCategoriesAdmin(
    @Query()
    getAllAttributesQueryDTO: GetAllAttributeQueryDTO,
  ) {
    return this.productService.getAllAttributes(getAllAttributesQueryDTO);
  }
}
