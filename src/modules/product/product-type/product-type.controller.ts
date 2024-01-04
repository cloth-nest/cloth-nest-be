import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../../../shared/decorators';
import { Permission } from '../../../shared/enums';
import { ProductTypeService } from './product-type.service';
import {
  GetAllProductTypeQueryDTO,
  GetAllProductAttributesParamDto,
  CreateProductTypeBodyDTO,
  AddAttributeBodyDTO,
  RemoveAttributeBodyDTO,
  DeleteProductTypeParamDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extensionImageReg } from '../../../shared/constants';

@Controller('product/type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllProductTypes(
    @Query() getAllProductTypeQueryDTO: GetAllProductTypeQueryDTO,
  ) {
    return this.productTypeService.getAllProductTypes(
      getAllProductTypeQueryDTO,
    );
  }

  @Auth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAllAttributeBelongToProductType(
    @Param() param: GetAllProductAttributesParamDto,
  ) {
    return this.productTypeService.getAllAttributeBelongToProductType(param.id);
  }

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  createProductType(
    @Body() createProductTypeBodyDTO: CreateProductTypeBodyDTO,
    @UploadedFile(
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
    sizeChartImg: Express.Multer.File,
  ) {
    return this.productTypeService.createProductType(
      createProductTypeBodyDTO,
      sizeChartImg,
    );
  }

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProductType(
    @Param() deleteProductTypeParamDto: DeleteProductTypeParamDto,
  ) {
    return this.productTypeService.deleteProductType(
      deleteProductTypeParamDto.id,
    );
  }

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
  @Post('/attribute')
  @HttpCode(HttpStatus.CREATED)
  addAttributes(@Body() addAttributeBodyDTO: AddAttributeBodyDTO) {
    return this.productTypeService.addAttributes(addAttributeBodyDTO);
  }

  @Auth(Permission.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES)
  @Delete('/attribute')
  @HttpCode(HttpStatus.OK)
  removeAttributes(@Body() removeAttributeBodyDTO: RemoveAttributeBodyDTO) {
    return this.productTypeService.removeAttributes(removeAttributeBodyDTO);
  }
}
