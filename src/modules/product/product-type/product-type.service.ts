import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import {
  AssignedProductAttribute,
  AssignedVariantAttribute,
  AttributeValue,
  Product,
  ProductAttribute,
  ProductType,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
} from '../../../entities';
import {
  AddAttributeBodyDTO,
  CreateProductTypeBodyDTO,
  GetAllProductTypeQueryDTO,
  RemoveAttributeBodyDTO,
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
    @InjectRepository(AssignedProductAttribute)
    private assignedProductAttributeRepo: Repository<AssignedProductAttribute>,
    @InjectRepository(AssignedVariantAttribute)
    private assignedVariantAttributeRepo: Repository<AssignedVariantAttribute>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
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

  public async deleteProductType(productTypeId: string) {
    try {
      // Check product type exist
      const productType = await this.productTypeRepo.findOne({
        where: {
          id: parseInt(productTypeId),
        },
      });
      if (!productType) {
        throw new CustomErrorException(ERRORS.ProductTypeNotExist);
      }

      // Check productType has product
      const product = await this.productRepo.findOne({
        where: {
          productTypeId: parseInt(productTypeId),
        },
      });
      if (product) {
        throw new CustomErrorException(ERRORS.ProductTypeHasProduct);
      }

      // Check productType has product attribute
      const productAttribute = await this.productAttributeRepo.findOne({
        where: [
          {
            productTypeProductAttribute: {
              productTypeId: parseInt(productTypeId),
            },
          },
          {
            productTypeProductAttribute: {
              productTypeId: parseInt(productTypeId),
            },
          },
        ],
      });
      if (productAttribute) {
        throw new CustomErrorException(ERRORS.ProductTypeHasProductAttribute);
      }

      // Delete product type
      await this.productTypeRepo.delete({
        id: parseInt(productTypeId),
      });

      return {
        message: 'Delete product type successfully',
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

  public async removeAttributes(
    removeAttributeBodyDTO: RemoveAttributeBodyDTO,
  ) {
    try {
      // Destructure body
      const { productTypeId, attributeType, productAttributeIds } =
        removeAttributeBodyDTO;

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
        const productTypeProductAttribute =
          await this.productTypeProductAttributeRepo.count({
            where: {
              productTypeId,
              productAttributeId: In(productAttributeIds),
            },
          });
        if (productTypeProductAttribute !== productAttributeIds.length) {
          throw new CustomErrorException(
            ERRORS.ProductAttributeNotExistInProductType,
          );
        }

        // Check product type attribute assigned exist
        const countedProductAttributeValue =
          await this.assignedProductAttributeRepo.count({
            where: {
              productTypeProductAttribute: {
                productTypeId,
                productAttributeId: In(productAttributeIds),
              },
            },
          });
        if (countedProductAttributeValue) {
          throw new CustomErrorException(ERRORS.ProductAttributeAssignedExist);
        }

        // Remove product type attribute
        await this.productTypeProductAttributeRepo.delete({
          productTypeId,
          productAttributeId: In(productAttributeIds),
        });

        return {
          message: 'Remove attributes successfully',
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
        if (productTypeVariantAttribute !== productAttributeIds.length) {
          throw new CustomErrorException(
            ERRORS.VariantAttributeNotExistInProductType,
          );
        }

        // Check product type variant attribute assigned exist
        const countedProductVariantAttributeValue =
          await this.assignedVariantAttributeRepo.count({
            where: {
              productTypeProductVariant: {
                productTypeId,
                productAttributeId: In(productAttributeIds),
              },
            },
          });
        if (countedProductVariantAttributeValue) {
          throw new CustomErrorException(ERRORS.VariantAttributeAssignedExist);
        }

        // Remove product type variant attribute
        await this.productTypeProductVariantRepo.delete({
          productTypeId,
          productAttributeId: In(productAttributeIds),
        });

        return {
          message: 'Remove attributes successfully',
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
