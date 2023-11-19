import { Injectable } from '@nestjs/common';
import {
  CreateOneCategoryBodyDto,
  GetAllCategoriesQueryDTO,
  UpdateOneCategoryBodyDTO,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { paginate } from '../../shared/utils/pager.util';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';

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

  public async updateOneCategory(
    categoryId: string,
    updateOneCategoryBodyDTO: UpdateOneCategoryBodyDTO,
  ) {
    try {
      const category = await this.categoryRepo.count({
        where: { id: parseInt(categoryId) },
      });
      if (!category) {
        throw new CustomErrorException(ERRORS.CategoryNotExist);
      }

      // Update category
      await this.categoryRepo.update(
        {
          id: parseInt(categoryId),
        },
        updateOneCategoryBodyDTO,
      );

      return {
        message: 'Update category successfully',
        data: {
          id: parseInt(categoryId),
          ...updateOneCategoryBodyDTO,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createOneCategory(
    createCategoryBodyDto: CreateOneCategoryBodyDto,
  ) {
    try {
      // Destructure body
      const { name, description, parentId } = createCategoryBodyDto;

      let parentCategory: Category = undefined;

      // Check if parentCategory is exist
      if (parentId) {
        parentCategory = await this.categoryRepo.findOne({
          where: { id: parentId },
          select: ['id', 'level'],
        });
        if (!parentCategory) {
          throw new CustomErrorException(ERRORS.ParentCategoryNotExist);
        }
      }

      // Create new category
      const createdCategory = await this.categoryRepo.save({
        name,
        description,
        level: parentCategory ? parentCategory.level + 1 : 0,
        parentCategory,
      });

      return {
        message: 'Create category successfully',
        data: _.omit(createdCategory, [
          'parentCategory',
          'createdAt',
          'updatedAt',
        ]),
      };
    } catch (err) {
      throw err;
    }
  }
}
