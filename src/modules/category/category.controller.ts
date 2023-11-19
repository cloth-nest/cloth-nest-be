import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { FindOneCategoryParamDto, GetAllCategoriesQueryDTO } from './dto';

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
}
