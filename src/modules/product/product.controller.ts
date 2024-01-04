import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
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
  GetProductVariantAdminParamDTO,
  GetAllImagesBelongToProductParamDto,
  CreateProductBodyDTO,
  DeleteImageParamDTO,
  BulkCreateImageBodyDTO,
  UpdateProductBodyDTO,
  UpdateProductParamDto,
  GetAllVariantAttributeBelongToProductParamDTO,
  CreateProductVariantBodyDTO,
} from './dto';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extensionImageReg } from '../../shared/constants';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth()
  @Get('attributes')
  @HttpCode(HttpStatus.OK)
  getAllAttributes(
    @Query()
    getAllAttributesQueryDTO: GetAllAttributeQueryDTO,
  ) {
    return this.productService.getAllAttributes(getAllAttributesQueryDTO);
  }

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
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

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
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

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
  @Delete('attributes/:id')
  @HttpCode(HttpStatus.OK)
  deleteProductAttribute(@Param() param: DeleteProductAttributeParamDto) {
    return this.productService.deleteProductAttribute(param.id);
  }

  @Auth()
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

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
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

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
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

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
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
  @Post('/admin')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() createProductBodyDTO: CreateProductBodyDTO) {
    return this.productService.createProduct(createProductBodyDTO);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Patch('/admin/:id')
  @HttpCode(HttpStatus.OK)
  updateProduct(
    @Param() updateProductParamDto: UpdateProductParamDto,
    @Body() updateProductBodyDTO: UpdateProductBodyDTO,
  ) {
    return this.productService.updateProduct(
      updateProductParamDto.id,
      updateProductBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Delete('/admin/image/:id')
  @HttpCode(HttpStatus.OK)
  deleteImage(@Param() deleteImageParamDTO: DeleteImageParamDTO) {
    return this.productService.deleteImage(deleteImageParamDTO.id);
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('/admin/image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 8))
  bulkCreateImage(
    @Body() bulkCreateImageBodyDTO: BulkCreateImageBodyDTO,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: extensionImageReg,
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    return this.productService.bulkCreateImage(bulkCreateImageBodyDTO, files);
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

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('/admin/variant/:id')
  @HttpCode(HttpStatus.OK)
  getProductVariantAdmin(
    @Param() getProductVariantAdminParamDTO: GetProductVariantAdminParamDTO,
  ) {
    return this.productService.getProductVariantAdmin(
      getProductVariantAdminParamDTO.id,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Post('/admin/variant')
  @HttpCode(HttpStatus.CREATED)
  createProductVariant(
    @Body() createProductVariantBodyDTO: CreateProductVariantBodyDTO,
  ) {
    return this.productService.createProductVariant(
      createProductVariantBodyDTO,
    );
  }

  @Auth(Permission.MANAGE_PRODUCTS)
  @Get('/admin/:id/variant')
  @HttpCode(HttpStatus.OK)
  getAllVariantAtributesBelongToProduct(
    @Param()
    getAllVariantAttributeBelongToProductParamDTO: GetAllVariantAttributeBelongToProductParamDTO,
  ) {
    return this.productService.getAllVariantAtributesBelongToProduct(
      getAllVariantAttributeBelongToProductParamDTO.id,
    );
  }

  @Get('/:id/images')
  @HttpCode(HttpStatus.OK)
  getAllImagesBelongToProduct(
    @Param()
    getAllImagesBelongToProductParamDto: GetAllImagesBelongToProductParamDto,
  ) {
    return this.productService.getAllImagesBelongToProduct(
      getAllImagesBelongToProductParamDto.id,
    );
  }
}
