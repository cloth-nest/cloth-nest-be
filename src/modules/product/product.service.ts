import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { AttributeValue, ProductAttribute } from '../../entities';
import { paginate } from '../../shared/utils';
import {
  CreateProductAttributeBodyDTO,
  GetAllAttributeQueryDTO,
  GetAllAttributeValuesQueryDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepo: Repository<ProductAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
  ) {}

  public async getAllAttributes(
    getAllCategoriesAdminQueryDTO: GetAllAttributeQueryDTO,
  ) {
    try {
      // Destructor query
      const { search, limit, page } = getAllCategoriesAdminQueryDTO;

      // Get all product attributes && total
      const [productAttributes, total] =
        await this.productAttributeRepo.findAndCount({
          where: {
            name:
              search &&
              Raw(
                (alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`,
              ),
          },
          select: ['id', 'name'],
          order: {
            name: 'ASC',
          },
          take: limit,
          skip: limit * (page - 1),
        });

      return {
        data: {
          productAttributes,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createProductAttribute(
    createProductAttributeBodyDTO: CreateProductAttributeBodyDTO,
  ) {
    try {
      // Check product attribute exists
      const productAttribute = await this.productAttributeRepo.count({
        where: {
          name: createProductAttributeBodyDTO.productAttributeName,
        },
      });

      if (productAttribute) {
        throw new CustomErrorException(ERRORS.ProductAttributeNameExist);
      }

      // Create product attribute
      const createdProductAttribute = await this.productAttributeRepo.save({
        name: createProductAttributeBodyDTO.productAttributeName,
      });

      return {
        message: 'Create product attribute successfully',
        data: {
          productAttribute: _.omit(createdProductAttribute, [
            'createdAt',
            'updatedAt',
          ]),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllAttributeValues(
    attributeId: string,
    getAllAttributeValuesQueryDTO: GetAllAttributeValuesQueryDTO,
  ) {
    try {
      // Check product attribute exists
      const productAttribute = await this.productAttributeRepo.count({
        where: {
          id: parseInt(attributeId),
        },
      });

      if (!productAttribute) {
        throw new CustomErrorException(ERRORS.ProductAttributeNotExist);
      }

      // Destructor query
      const { limit, page } = getAllAttributeValuesQueryDTO;

      // Get all attribute values && total
      const [attributeValues, total] =
        await this.attributeValueRepo.findAndCount({
          where: {
            attributeId: parseInt(attributeId),
          },
          select: ['id', 'value'],
          order: {
            value: 'ASC',
          },
          take: limit,
          skip: limit * (page - 1),
        });

      return {
        data: {
          attributeValues,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
