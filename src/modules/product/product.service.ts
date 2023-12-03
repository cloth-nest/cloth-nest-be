import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, In, LessThan, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import {
  AttributeValue,
  Category,
  Product,
  ProductAttribute,
  ProductType,
} from '../../entities';
import { paginate } from '../../shared/utils';
import {
  CreateAttributeValueBodyDTO,
  CreateProductAttributeBodyDTO,
  GetAllAttributeQueryDTO,
  GetAllAttributeValuesQueryDTO,
  UpdateAttributeValueBodyDTO,
  GetAllProductsBelongToCategoryQueryDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';
import { PriceRange, ProductOrderDirection } from '../../shared/enums';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepo: Repository<ProductAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductType)
    private productTypeRepo: Repository<ProductType>,
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

  public async updateAttributeValue(
    attributeValueId: string,
    updateAttributeValueBodyDTO: UpdateAttributeValueBodyDTO,
  ) {
    try {
      // Check attribute value exists
      const attributeValue = await this.attributeValueRepo.count({
        where: {
          id: parseInt(attributeValueId),
        },
      });

      if (!attributeValue) {
        throw new CustomErrorException(ERRORS.ProductAttributeValueNotExist);
      }

      // Update attribute value
      await this.attributeValueRepo.update(
        {
          id: parseInt(attributeValueId),
        },
        {
          value: updateAttributeValueBodyDTO.attributeValue,
        },
      );

      return {
        message: 'Update attribute value successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async deleteAttributeValue(attributeValueId: string) {
    try {
      // Check attribute value exists
      const attributeValue = await this.attributeValueRepo.count({
        where: {
          id: parseInt(attributeValueId),
        },
      });

      if (!attributeValue) {
        throw new CustomErrorException(ERRORS.ProductAttributeValueNotExist);
      }

      // Delete attribute value
      await this.attributeValueRepo.delete({
        id: parseInt(attributeValueId),
      });

      return {
        message: 'Delete attribute value successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllProductBelongToCategory(
    categoryId: string,
    getAllProductBelongToCategoryQueryDTO: GetAllProductsBelongToCategoryQueryDTO,
  ) {
    try {
      // Check category exists
      const category = await this.categoryRepo.count({
        where: {
          id: parseInt(categoryId),
        },
      });

      if (!category) {
        throw new CustomErrorException(ERRORS.CategoryNotExist);
      }

      // Destructor query
      const {
        priceRange,
        prodTypeIdList,
        colorIdList,
        sizeIdList,
        orderDirection,
        limit,
        page,
      } = getAllProductBelongToCategoryQueryDTO;

      // Check product type valid
      if (prodTypeIdList) {
        const countedProductType = await this.productTypeRepo.count({
          where: {
            id: In(prodTypeIdList),
          },
        });

        if (countedProductType !== prodTypeIdList.length) {
          throw new CustomErrorException(ERRORS.ProductTypeNotExist);
        }
      }

      // Check color valid
      if (colorIdList) {
        const countedColor = await this.attributeValueRepo.count({
          where: {
            id: In(colorIdList),
            attribute: {
              name: 'Color',
            },
          },
        });

        if (countedColor !== colorIdList.length) {
          throw new CustomErrorException(ERRORS.ColorNotExist);
        }
      }

      // Check size valid
      if (sizeIdList) {
        const countedSize = await this.attributeValueRepo.count({
          where: {
            id: In(sizeIdList),
            attribute: {
              name: 'Size',
            },
          },
        });

        if (countedSize !== sizeIdList.length) {
          throw new CustomErrorException(ERRORS.SizeNotExist);
        }
      }

      // Get color size value id list
      const colorSizeIdList = [];
      !_.isEmpty(colorIdList) && colorSizeIdList.push(...colorIdList);
      !_.isEmpty(sizeIdList) && colorSizeIdList.push(...sizeIdList);
      console.log(colorSizeIdList);

      // Handle criteria price range
      const criteriaPriceRange = {
        ...(priceRange === PriceRange.ALL && { price: undefined }),
        ...(priceRange === PriceRange.LT10 && { price: LessThan(10) }),
        ...(priceRange === PriceRange.GTE10_LT20 && {
          price: And(MoreThanOrEqual(10), LessThan(20)),
        }),
        ...(priceRange === PriceRange.GTE20_LT30 && {
          price: And(MoreThanOrEqual(20), LessThan(30)),
        }),
        ...(priceRange === PriceRange.GTE30_LT50 && {
          price: And(MoreThanOrEqual(30), LessThan(50)),
        }),
        ...(priceRange === PriceRange.GTE50 && {
          price: MoreThanOrEqual(50),
        }),
      };

      // Get all products && total
      const [products, total] = await this.productRepo.findAndCount({
        where: {
          categoryId: parseInt(categoryId),
          productTypeId: _.isEmpty(prodTypeIdList)
            ? undefined
            : In(prodTypeIdList),
          price: priceRange ? criteriaPriceRange.price : undefined,
          productVariants: {
            assignedVariantAttributes: {
              assignedVariantAttributeValues: {
                attributeValue: {
                  id: _.isEmpty(colorSizeIdList)
                    ? undefined
                    : In(colorSizeIdList),
                },
              },
            },
          },
        },
        select: ['id', 'name', 'price', 'description', 'createdAt'],
        // Sort by order direction
        order: {
          ...(orderDirection === ProductOrderDirection.LATEST && {
            createdAt: 'DESC',
          }),
          ...(orderDirection === ProductOrderDirection.PRICE_DESC && {
            price: 'ASC',
          }),
          ...(orderDirection === ProductOrderDirection.PRICE_ASC && {
            price: 'DESC',
          }),
        },
        relations: ['defaultVariant', 'productImages'],
        take: limit,
        skip: limit * (page - 1),
      });

      const colorProducts = await this.getColorsOfProducts(
        products.map((product) => product.id),
      );

      const formatedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.productImages[0]?.image,
        productVariantId: product.defaultVariant.id,
        colors: colorProducts[product.id],
      }));

      return {
        data: {
          products: formatedProducts,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getColorsOfProducts(productIdList: number[]) {
    const mockColor = _.mapValues(_.keyBy(productIdList), () =>
      faker.helpers.arrayElements(
        [
          'Red',
          'Orange',
          'Yellow',
          'Green',
          'Blue',
          'Purple',
          'Pink',
          'Brown',
          'White',
          'Black',
          'Grey',
          'Multi-Colour',
        ],
        {
          min: 2,
          max: 6,
        },
      ),
    );

    return mockColor;

    const attributeColorId = await this.productAttributeRepo.findOne({
      where: {
        name: 'Color',
      },
      select: ['id'],
    });

    const productColors = await this.productRepo
      .createQueryBuilder('product')
      .where('product.id @> ARRAY[:...ids]', {
        ids: productIdList,
      })
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect(
        'productVariants.assignedVariantAttributes',
        'assignedVariantAttributes',
      )
      .leftJoinAndSelect(
        'assignedVariantAttributes.assignedVariantAttributeValues',
        'assignedVariantAttributeValues',
      )
      .leftJoinAndSelect(
        'assignedVariantAttributeValues.attributeValue',
        'attributeValue',
      )
      .select(['product.id AS "productId"', 'attributeValue.value AS "value"'])
      .where('attributeValue.attributeId = :id', {
        id: attributeColorId,
      })
      .getRawMany();
    const formatedResult = _.mapValues(
      _.groupBy(productColors, 'productId'),
      (productColorList) => productColorList.map((x) => x.value),
    );

    return formatedResult;
  }
}
