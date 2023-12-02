import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import {
  AttributeValue,
  ProductAttribute,
  ProductType,
  ProductTypeProductAttribute,
} from '../../../entities';
import {
  CreateProductTypeBodyDTO,
  GetAllProductAttributesQueryDTO,
  GetAllProductTypeQueryDTO,
} from './dto';
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

    try {
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

  public async getAllAttributeBelongToProductType(
    productTypeId: string,
    getAllProductAttributesQueryDTO: GetAllProductAttributesQueryDTO,
  ) {
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

      // Destructor query
      const { limit, page } = getAllProductAttributesQueryDTO;

      // Get all product attributes && total
      const [productAttributes, total] =
        await this.productTypeProductTypeRepo.findAndCount({
          where: {
            productTypeId: parseInt(productTypeId),
          },
          select: ['productAttribute'],
          order: {
            order: 'ASC',
          },
          relations: ['productAttribute'],
          take: limit,
          skip: limit * (page - 1),
        });

      return {
        data: {
          productAttributes: productAttributes.map(
            (productAttribute) => productAttribute.productAttribute,
          ),
          pageInformation: paginate(limit, page, total),
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
