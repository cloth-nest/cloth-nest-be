import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetAllCategoriesQueryDTO } from './dto';

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
}
