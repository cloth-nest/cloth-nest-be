import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { AttributeValue, ProductAttribute } from '../../entities';
import { paginate } from '../../shared/utils';
import {
  CreateAttributeValueBodyDTO,
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

  public async updateProductAttribute(
    attributeId: string,
    updateProductAttributeBodyDTO: CreateProductAttributeBodyDTO,
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

      // Update product attribute
      await this.productAttributeRepo.update(
        {
          id: parseInt(attributeId),
        },
        {
          name: updateProductAttributeBodyDTO.productAttributeName,
        },
      );

      return {
        message: 'Update product attribute successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async deleteProductAttribute(attributeId: string) {
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

      // Check product attribute has values
      const productAttributeValues = await this.attributeValueRepo.count({
        where: {
          attributeId: parseInt(attributeId),
        },
      });

      if (productAttributeValues) {
        throw new CustomErrorException(
          ERRORS.ProductAttributeHasValuesCanNotDelete,
        );
      }

      // Delete product attribute
      await this.productAttributeRepo.delete({
        id: parseInt(attributeId),
      });

      return {
        message: 'Delete product attribute successfully',
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

  public async createAttributeValue(
    createAttributeValueBodyDTO: CreateAttributeValueBodyDTO,
  ) {
    try {
      // Check product attribute exists
      const productAttribute = await this.productAttributeRepo.count({
        where: {
          id: createAttributeValueBodyDTO.attributeId,
        },
      });

      if (!productAttribute) {
        throw new CustomErrorException(ERRORS.ProductAttributeNotExist);
      }

      // Check attribute value exists
      const attributeValue = await this.attributeValueRepo.count({
        where: {
          attributeId: createAttributeValueBodyDTO.attributeId,
          value: createAttributeValueBodyDTO.attributeValue,
        },
      });

      if (attributeValue) {
        throw new CustomErrorException(ERRORS.ProductAttributeValueExist);
      }

      // Create attribute value
      const createdAttributeValue = await this.attributeValueRepo.save({
        attributeId: createAttributeValueBodyDTO.attributeId,
        value: createAttributeValueBodyDTO.attributeValue,
      });

      return {
        message: 'Create attribute value successfully',
        data: {
          attributeValue: _.omit(createdAttributeValue, [
            'createdAt',
            'updatedAt',
          ]),
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
