import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  FindOneCategoryParamDto,
  GetAllCategoriesQueryDTO,
  UpdateOneCategoryBodyDTO,
  UpdateOneCategoryParamDto,
} from './dto';
import { Auth } from '../../shared/decorators';
import { Permission } from 'src/shared/enums';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllCategories(
    @Query()
    getAllCategoriesQueryDTO: GetAllCategoriesQueryDTO,
  ) {
    return this.categoryService.getAllCategories(getAllCategoriesQueryDTO);
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
}
