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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateOneCategoryBodyDto,
  FindOneCategoryParamDto,
  GetAllCategoriesAdminQueryDTO,
  GetAllCategoriesUserQueryDTO,
  UpdateOneCategoryBodyDTO,
  UpdateOneCategoryParamDto,
} from './dto';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { extensionImageReg } from '../../shared/constants';
import { Express } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth(Permission.MANAGE_CATEGORIES)
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  getAllCategoriesAdmin(
    @Query()
    getAllCategoriesAdminQueryDTO: GetAllCategoriesAdminQueryDTO,
  ) {
    return this.categoryService.getAllCategoriesAdmin(
      getAllCategoriesAdminQueryDTO,
    );
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllCategoriesUser(
    @Query()
    getAllCategoriesUserQueryDTO: GetAllCategoriesUserQueryDTO,
  ) {
    return this.categoryService.getAllCategoriesUser(
      getAllCategoriesUserQueryDTO,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneCategory(@Param() param: FindOneCategoryParamDto) {
    return this.categoryService.getOneCategory(param.id);
  }

  @Auth(Permission.MANAGE_CATEGORIES)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('bgImg'))
  updateOneCategory(
    @Param() param: UpdateOneCategoryParamDto,
    @Body() updateCategoryBodyDto: UpdateOneCategoryBodyDTO,
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
    bgImg: Express.Multer.File,
  ) {
    return this.categoryService.updateOneCategory(
      param.id,
      updateCategoryBodyDto,
      bgImg,
    );
  }

  @Auth(Permission.MANAGE_CATEGORIES)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  createOneCategory(
    @Body() createCategoryBodyDto: CreateOneCategoryBodyDto,
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
    file: Express.Multer.File,
  ) {
    return this.categoryService.createOneCategory(createCategoryBodyDto, file);
  }

  @Auth(Permission.MANAGE_CATEGORIES)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteOneCategory(@Param() param: FindOneCategoryParamDto) {
    return this.categoryService.deleteOneCategory(param.id);
  }
}
