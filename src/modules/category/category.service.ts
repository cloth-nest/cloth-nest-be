import { Injectable } from '@nestjs/common';
import {
  CreateOneCategoryBodyDto,
  GetAllCategoriesAdminQueryDTO,
  GetAllCategoriesUserQueryDTO,
  UpdateOneCategoryBodyDTO,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';
import { treeMap, paginate } from '../../shared/utils';
import { FileUploadService } from '../../shared/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    private fileUploadSerivce: FileUploadService,
    private configService: ConfigService,
  ) {}

  public async getAllCategoriesAdmin(
    getAllCategoriesAdminQueryDTO: GetAllCategoriesAdminQueryDTO,
  ) {
    try {
      // Destructor query
      const { level, parentId, limit, page } = getAllCategoriesAdminQueryDTO;

      let parentCategory: Category = undefined;

      // Check if parentCategory is exist
      if (parentId) {
        parentCategory = await this.categoryRepo.findOne({
          where: { id: parentId },
        });
        if (!parentCategory) {
          throw new CustomErrorException(ERRORS.ParentCategoryNotExist);
        }
      }

      // Get categories and total
      const [categories, total] = await this.categoryRepo.manager
        .getTreeRepository(Category)
        .findAndCount({
          where: {
            level,
            parentId,
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

  public async getAllCategoriesUser(
    getAllCategoriesUserQueryDTO: GetAllCategoriesUserQueryDTO,
  ) {
    try {
      // Destructor query
      const { depth } = getAllCategoriesUserQueryDTO;

      // Get categories
      const categories = await this.categoryRepo.manager
        .getTreeRepository(Category)
        .findTrees({
          depth,
        });

      return {
        // Remove createdAt, updatedAt
        data: treeMap(
          categories,
          (node) => ({
            id: node.id,
            name: node.name,
            description: node.description,
            bgImgUrl: node.bgImgUrl,
            level: node.level,
            childs: node.childs,
          }),
          { id: 'id', children: 'childs' },
        ),
      };
    } catch (err) {
      throw err;
    }
  }

  public async getOneCategory(categoryId: string) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id: parseInt(categoryId) },
        select: ['id', 'description', 'name', 'level', 'bgImgUrl'],
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
    bgImg: Express.Multer.File,
  ) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id: parseInt(categoryId) },
        select: ['id', 'bgImgUrl'],
      });
      if (!category) {
        throw new CustomErrorException(ERRORS.CategoryNotExist);
      }

      let bgImgUrl: string = undefined;
      if (bgImg) {
        // Upload bg img category to S3 & return url
        bgImgUrl = await this.fileUploadSerivce.uploadFileToS3(
          bgImg.buffer,
          this.getS3Key(parseInt(categoryId), bgImg.originalname),
        );
      }

      // Update category
      await this.categoryRepo.update(
        {
          id: parseInt(categoryId),
        },
        {
          ...updateOneCategoryBodyDTO,
          bgImgUrl,
        },
      );

      // Remove old bg image if exist
      if (category.bgImgUrl) {
        await this.fileUploadSerivce.removeFileFromS3(
          this.extractFileDestFromImageUrl(category.bgImgUrl),
        );
      }

      return {
        message: 'Update category successfully',
        data: {
          id: parseInt(categoryId),
          ...updateOneCategoryBodyDTO,
          bgImg: bgImgUrl,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createOneCategory(
    createCategoryBodyDto: CreateOneCategoryBodyDto,
    file: Express.Multer.File,
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
        parent: parentCategory,
      });

      // Upload user avatar to S3
      let bgImgUrl: string = undefined;
      if (file) {
        bgImgUrl = await this.fileUploadSerivce.uploadFileToS3(
          file.buffer,
          this.getS3Key(createdCategory.id, file.originalname),
        );

        // Save background image url to database
        await this.categoryRepo.update(
          {
            id: createdCategory.id,
          },
          {
            bgImgUrl,
          },
        );
      }

      return {
        message: 'Create category successfully',
        data: {
          ..._.omit(createdCategory, [
            'parent',
            'parentId',
            'createdAt',
            'updatedAt',
          ]),
          bgImgUrl,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  private getS3Key(categoryId: number, fileName: string): string {
    return `${this.configService.get<string>(
      'AWS_S3_CATEGORY_FOLDER',
    )}/${categoryId}-${Date.now()}-${fileName}`;
  }

  private extractFileDestFromImageUrl(imageUrl: string): string {
    return imageUrl.replace(`${this.fileUploadSerivce.getS3Url()}/`, '');
  }
}
