import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import {
  AttributeValue,
  ProductAttribute,
  ProductType,
  ProductTypeProductAttribute,
} from '../../../entities';
import { CreateProductTypeBodyDTO, GetAllProductTypeQueryDTO } from './dto';
import { CustomErrorException } from '../../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../../shared/constants';
import * as _ from 'lodash';
import { paginate } from '../../../shared/utils';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepo: Repository<ProductAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(ProductType)
    private productTypeRepo: Repository<ProductType>,
    @InjectRepository(ProductTypeProductAttribute)
    private productTypeProductTypeRepo: Repository<ProductTypeProductAttribute>,
  ) {}

  public async getAllProductTypes(
    getAllProductTypeQueryDTO: GetAllProductTypeQueryDTO,
  ) {
    try {
      // Destructor query
      const { search, limit, page } = getAllProductTypeQueryDTO;

      // Get all product attributes && total
      const [productTypes, total] = await this.productTypeRepo.findAndCount({
        where: {
          name:
            search &&
            Raw((alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`),
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
          productTypes,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllAttributeBelongToProductType(productTypeId: string) {
    try {
      // Check product type exist
      const productType = await this.productTypeRepo.count({
        where: {
          id: parseInt(productTypeId),
        },
      });

      if (!productType) {
        throw new CustomErrorException(ERRORS.ProductTypeNotExist);
      }

      const productAttributes = await this.productAttributeRepo.find({
        where: {
          productTypeProductAttribute: {
            productTypeId: parseInt(productTypeId),
          },
        },
        select: ['id', 'name'],
      });

      const variantAttributes = await this.productAttributeRepo.find({
        where: {
          productTypeProductVariant: {
            productTypeId: parseInt(productTypeId),
          },
        },
        select: ['id', 'name'],
      });

      return {
        data: {
          productAttributes,
          variantAttributes,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createProductType(
    createProductTypeBodyDTO: CreateProductTypeBodyDTO,
  ) {
    try {
      // Check product type exist
      const productType = await this.productTypeRepo.findOne({
        where: {
          name: createProductTypeBodyDTO.productTypeName,
        },
      });

      if (productType) {
        throw new CustomErrorException(ERRORS.ProductTypeAlreadyExist);
      }

      // Create product type
      const createdProductType = await this.productTypeRepo.save({
        name: createProductTypeBodyDTO.productTypeName,
      });

      return {
        message: 'Create product type successfully',
        data: _.omit(createdProductType, ['createdAt', 'updatedAt']),
      };
    } catch (err) {
      throw err;
    }
  }
}
