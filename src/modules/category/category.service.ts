import { Injectable } from '@nestjs/common';
import { GetAllCategoriesQueryDTO } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { paginate } from 'src/shared/utils/pager.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  public async getAllCategories(
    getAllCategoriesQueryDTO: GetAllCategoriesQueryDTO,
  ) {
    // Destructor query
    const { level, limit, page } = getAllCategoriesQueryDTO;

    // Get categories and total
    const [categories, total] = await this.categoryRepo.findAndCount({
      where: {
        level,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: {
        categories,
        pageInformation: paginate(limit, page, total),
      },
    };
  }
}
