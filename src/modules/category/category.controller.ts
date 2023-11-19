import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
  updateOneCategory(
    @Param() param: UpdateOneCategoryParamDto,
    @Body() updateCategoryBodyDto: UpdateOneCategoryBodyDTO,
  ) {
    return this.categoryService.updateOneCategory(
      param.id,
      updateCategoryBodyDto,
    );
  }

  @Auth(Permission.MANAGE_CATEGORIES)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createOneCategory(@Body() createCategoryBodyDto: CreateOneCategoryBodyDto) {
    return this.categoryService.createOneCategory(createCategoryBodyDto);
  }
}
