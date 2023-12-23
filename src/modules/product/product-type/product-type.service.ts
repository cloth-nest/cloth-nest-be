import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import {
  AttributeValue,
  ProductAttribute,
  ProductType,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
} from '../../../entities';
import {
  AddAttributeBodyDTO,
  CreateProductTypeBodyDTO,
  GetAllProductTypeQueryDTO,
} from './dto';
import { CustomErrorException } from '../../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../../shared/constants';
import * as _ from 'lodash';
import { paginate } from '../../../shared/utils';
import { AttributeType } from '../../../shared/enums';

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
    private productTypeProductAttributeRepo: Repository<ProductTypeProductAttribute>,
    @InjectRepository(ProductTypeProductVariant)
    private productTypeProductVariantRepo: Repository<ProductTypeProductVariant>,
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

  public async addAttributes(addAttributeBodyDTO: AddAttributeBodyDTO) {
    try {
      // Destructure body
      const { productTypeId, attributeType, productAttributeIds } =
        addAttributeBodyDTO;

      // Check product type exist
      const productType = await this.productTypeRepo.count({
        where: {
          id: productTypeId,
        },
      });
      if (!productType) {
        throw new CustomErrorException(ERRORS.ProductTypeNotExist);
      }

      // Check product attributes exist
      const productAttributes = await this.productAttributeRepo.count({
        where: {
          id: In(productAttributeIds),
        },
      });
      if (productAttributes !== productAttributeIds.length) {
        throw new CustomErrorException(ERRORS.ProductAttributeNotExist);
      }

      if (attributeType === AttributeType.PRODUCT_ATTRIBUTE) {
        // Check product type attribute exist
        const productTypeAttribute =
          await this.productTypeProductAttributeRepo.count({
            where: {
              productTypeId,
              productAttributeId: In(productAttributeIds),
            },
          });
        if (productTypeAttribute) {
          throw new CustomErrorException(
            ERRORS.ProductTypeProductAttributeAlreadyExist,
          );
        }

        // Check product type variant attribute exist
        const productTypeVariantAttribute =
          await this.productTypeProductVariantRepo.count({
            where: {
              productTypeId,
              productAttributeId: In(productAttributeIds),
            },
          });
        if (productTypeVariantAttribute) {
          throw new CustomErrorException(
            ERRORS.AttributeExistInVariantAttribute,
          );
        }

        // Get max order
        const countedProductTypeAttribute =
          await this.productTypeProductAttributeRepo.count({
            where: {
              productTypeId,
            },
          });

        // Add product type attribute
        const createdProductAttribute =
          await this.productTypeProductAttributeRepo.save(
            productAttributeIds.map((productAttributeId, idx) => ({
              productTypeId,
              productAttributeId,
              order: countedProductTypeAttribute + idx,
            })),
          );

        return {
          message: 'Add attributes successfully',
          data: createdProductAttribute,
        };
      } else {
        // Check product type variant attribute exist
        const productTypeVariantAttribute =
          await this.productTypeProductVariantRepo.count({
            where: {
              productTypeId,
              productAttributeId: In(productAttributeIds),
            },
          });
        if (productTypeVariantAttribute) {
          throw new CustomErrorException(
            ERRORS.ProductTypeVariantAttributeAlreadyExist,
          );
        }

        // Check product type attribute exist
        const productTypeAttribute =
          await this.productTypeProductAttributeRepo.count({
            where: {
              productTypeId,
              productAttributeId: In(productAttributeIds),
            },
          });
        if (productTypeAttribute) {
          throw new CustomErrorException(
            ERRORS.AttributeExistInProductAttribute,
          );
        }

        // Get max order
        const countedProductTypeVariantAttribute =
          await this.productTypeProductVariantRepo.count({
            where: {
              productTypeId,
            },
          });

        // Add product type variant attribute
        const createdVariantAttribute =
          await this.productTypeProductVariantRepo.save(
            productAttributeIds.map((productAttributeId, idx) => ({
              productTypeId,
              productAttributeId,
              order: countedProductTypeVariantAttribute + idx,
            })),
          );

        return {
          message: 'Add attributes successfully',
          data: createdVariantAttribute,
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
