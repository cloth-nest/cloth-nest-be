import { Injectable } from '@nestjs/common';
import { GetAllCategoriesQueryDTO } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { paginate } from '../../shared/utils/pager.util';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  public async getAllCategories(
    getAllCategoriesQueryDTO: GetAllCategoriesQueryDTO,
  ) {
    try {
      // Destructor query
      const { level, limit, page } = getAllCategoriesQueryDTO;

      // Get categories and total
      const [categories, total] = await this.categoryRepo.findAndCount({
        where: {
          level,
        },
        select: ['id', 'description', 'name', 'level'],
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        data: {
          categories,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getOneCategory(categoryId: string) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id: parseInt(categoryId) },
        select: ['id', 'description', 'name', 'level'],
      });

      if (!category) {
        throw new CustomErrorException(ERRORS.CategoryNotExist);
      }

      return {
        data: category,
      };
    } catch (err) {
      throw err;
    }
  }
}
