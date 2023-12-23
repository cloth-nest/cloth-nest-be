import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import {
  CreateAttributeValueBodyDTO,
  CreateProductAttributeBodyDTO,
  DeleteAttributeValueParamDto,
  DeleteProductAttributeParamDto,
  GetAllAttributeQueryDTO,
  GetAllAttributeValuesParamDto,
  GetAllAttributeValuesQueryDTO,
  GetAllProductsBelongToCategoryParamDto,
  GetAllProductsBelongToCategoryQueryDTO,
  GetAllProductsQueryDTO,
  GetProductDetailParamDto,
  GetProductDetailAdminParamDTO,
  GetRecommendationProductsParamDto,
  GetRecommendationProductsQueryDTO,
  SearchQueryDTO,
  UpdateAttributeValueBodyDTO,
  UpdateAttributeValueParamDto,
  UpdateProductAttributeBodyDTO,
  UpdateProductAttributeParamDto,
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
  @Post('attributes')
  @HttpCode(HttpStatus.CREATED)
  createProductAttribute(
    @Body()
    createProductAttributeBodyDTO: CreateProductAttributeBodyDTO,
  ) {
    return this.productService.createProductAttribute(
      createProductAttributeBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Patch('attributes/:id')
  @HttpCode(HttpStatus.OK)
  updateProductAttribute(
    @Param() param: UpdateProductAttributeParamDto,
    @Body()
    updateProductAttributeBodyDTO: UpdateProductAttributeBodyDTO,
  ) {
    return this.productService.updateProductAttribute(
      param.id,
      updateProductAttributeBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Delete('attributes/:id')
  @HttpCode(HttpStatus.OK)
  deleteProductAttribute(@Param() param: DeleteProductAttributeParamDto) {
    return this.productService.deleteProductAttribute(param.id);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('attributes/values/:id')
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

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('attributes/values')
  @HttpCode(HttpStatus.CREATED)
  createAttributeValue(
    @Body()
    createAttributeValueBodyDTO: CreateAttributeValueBodyDTO,
  ) {
    return this.productService.createAttributeValue(
      createAttributeValueBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Patch('attributes/values/:id')
  @HttpCode(HttpStatus.OK)
  updateAttributeValue(
    @Param() param: UpdateAttributeValueParamDto,
    @Body()
    updateAttributeValueBodyDTO: UpdateAttributeValueBodyDTO,
  ) {
    return this.productService.updateAttributeValue(
      param.id,
      updateAttributeValueBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Delete('attributes/values/:id')
  @HttpCode(HttpStatus.OK)
  deleteAttributeValue(@Param() param: DeleteAttributeValueParamDto) {
    return this.productService.deleteAttributeValue(param.id);
  }

  @Get('category/:id')
  @HttpCode(HttpStatus.OK)
  getAllProductBelongToCategory(
    @Param() param: GetAllProductsBelongToCategoryParamDto,
    @Query()
    getAllProductsBelongToCategoryQueryDTO: GetAllProductsBelongToCategoryQueryDTO,
  ) {
    return this.productService.getAllProductBelongToCategory(
      param.id,
      getAllProductsBelongToCategoryQueryDTO,
    );
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  search(
    @Query()
    searchQueryDTO: SearchQueryDTO,
  ) {
    return this.productService.search(searchQueryDTO);
  }

  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  getDetailProduct(@Param() param: GetProductDetailParamDto) {
    return this.productService.getDetailProduct(param.id);
  }

  @Get('rcm/:id')
  @HttpCode(HttpStatus.OK)
  getRecommendationProducts(
    @Param() param: GetRecommendationProductsParamDto,
    @Query()
    getRecommendationProductsQueryDTO: GetRecommendationProductsQueryDTO,
  ) {
    return this.productService.getRecommendationProducts(
      param.id,
      getRecommendationProductsQueryDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('/admin')
  @HttpCode(HttpStatus.OK)
  getAllProducts(@Query() getAllProductsQueryDto: GetAllProductsQueryDTO) {
    return this.productService.getAllProducts(getAllProductsQueryDto);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('/admin/:id')
  @HttpCode(HttpStatus.OK)
  getDetailProductAdmin(
    @Param() getProductDetailAdminParamDTO: GetProductDetailAdminParamDTO,
  ) {
    return this.productService.getDetailProductAdmin(
      getProductDetailAdminParamDTO.id,
    );
  }
}
