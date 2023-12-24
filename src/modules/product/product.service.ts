import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, In, LessThan, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import {
  AssignedProductAttribute,
  AttributeValue,
  Category,
  Product,
  ProductAttribute,
  ProductImage,
  ProductType,
  ProductVariant,
} from '../../entities';
import { paginate } from '../../shared/utils';
import {
  CreateAttributeValueBodyDTO,
  CreateProductAttributeBodyDTO,
  GetAllAttributeQueryDTO,
  GetAllAttributeValuesQueryDTO,
  UpdateAttributeValueBodyDTO,
  GetAllProductsBelongToCategoryQueryDTO,
  GetRecommendationProductsQueryDTO,
  SearchQueryDTO,
  GetAllProductsQueryDTO,
  CreateProductBodyDTO,
  BulkCreateImageBodyDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';
import { PriceRange, ProductOrderDirection } from '../../shared/enums';
import { faker } from '@faker-js/faker';
import { FileUploadService } from '../../shared/services';
import { ConfigService } from '@nestjs/config';

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
    @InjectRepository(ProductImage)
    private productImgRepo: Repository<ProductImage>,
    @InjectRepository(AssignedProductAttribute)
    private assignedProductAttributeRepo: Repository<AssignedProductAttribute>,
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    private fileUploadSerivce: FileUploadService,
    private configService: ConfigService,
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
          ...(orderDirection === ProductOrderDirection.PRICE_ASC && {
            price: 'ASC',
          }),
          ...(orderDirection === ProductOrderDirection.PRICE_DESC && {
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
        defautVariantId: product?.defaultVariant?.id,
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

  public async getDetailProduct(productId: string) {
    try {
      // Check product exists
      const product = await this.productRepo.count({
        where: {
          id: parseInt(productId),
        },
      });

      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Get product detail
      const [
        productDetail,
        images,
        productType,
        attributes,
        variants,
        attributeVariants,
      ] = await Promise.all([
        this.productRepo
          .createQueryBuilder('product')
          .where('product.id = :id', {
            id: parseInt(productId),
          })
          .leftJoinAndSelect('product.defaultVariant', 'defaultVariant')
          .select([
            'product.id',
            'product.name',
            'product.price',
            'product.description',
            'defaultVariant.id',
            'defaultVariant.name',
            'defaultVariant.sku',
            'defaultVariant.price',
          ])
          .getOne(),
        this.productImgRepo.find({
          where: {
            productId: parseInt(productId),
          },
          select: ['id', 'image', 'order'],
        }),
        this.productTypeRepo
          .createQueryBuilder('productType')
          .leftJoinAndSelect('productType.products', 'products')
          .where('products.id = :id', {
            id: parseInt(productId),
          })
          .leftJoinAndSelect(
            'productType.productTypeProductVariants',
            'productTypeProductVariants',
          )
          .leftJoinAndSelect(
            'productTypeProductVariants.productAttribute',
            'productAttribute',
          )
          .select([
            'productType.id',
            'productType.name',
            'productType.sizeChartImage',
            'productTypeProductVariants.productAttributeId',
            'productTypeProductVariants.productAttributeId',
            'productTypeProductVariants.order',
            'productAttribute.name',
          ])
          .getOne(),
        this.productAttributeRepo
          .createQueryBuilder('productAttribute')
          .leftJoinAndSelect(
            'productAttribute.productTypeProductAttribute',
            'productTypeProductAttribute',
          )
          .leftJoinAndSelect(
            'productTypeProductAttribute.assignedProductAttributes',
            'assignedProductAttributes',
          )
          .where('assignedProductAttributes.productId = :id', {
            id: parseInt(productId),
          })
          .leftJoinAndSelect(
            'assignedProductAttributes.assignedProductAttributeValues',
            'assignedProductAttributeValues',
          )
          .leftJoinAndSelect(
            'assignedProductAttributeValues.attributeValue',
            'attributeValue',
          )
          .select([
            'productAttribute.name AS "attributeName"',
            'attributeValue.value AS "value"',
          ])
          .getRawMany(),
        this.productVariantRepo
          .createQueryBuilder('variants')
          .where('variants.productId = :id', {
            id: parseInt(productId),
          })
          .leftJoinAndSelect('variants.variantImages', 'variantImages')
          .leftJoinAndSelect('variants.warehouseStocks', 'warehouseStocks')
          .leftJoinAndSelect('warehouseStocks.warehouse', 'warehouse')
          .select([
            'variants.id',
            'variants.name',
            'variants.order',
            'variants.sku',
            'variants.price',
            'variantImages.productImageId',
            'warehouse.name',
            'warehouseStocks.quantity',
          ])
          .getMany(),
        this.attributeValueRepo
          .createQueryBuilder('attributeValue')
          .leftJoinAndSelect(
            'attributeValue.assignedVariantAttributeValues',
            'assignedVariantAttributeValues',
          )
          .leftJoinAndSelect(
            'assignedVariantAttributeValues.assignedVariantAttribute',
            'assignedVariantAttribute',
          )
          .leftJoinAndSelect(
            'assignedVariantAttribute.productVariant',
            'productVariant',
          )
          .where('productVariant.productId = :id', {
            id: parseInt(productId),
          })
          .select([
            'attributeValue.id AS "id"',
            'attributeValue.value AS "value"',
            'attributeValue.attributeId AS "attributeId"',
            'assignedVariantAttributeValues.order AS "order"',
            'productVariant.id AS "variantId"',
          ])
          .getRawMany(),
      ]);

      const formatedProductDetail = {
        ...productDetail,
        attributes,
        images,
        productType: {
          id: productType.id,
          name: productType.name,
          sizeChartImage: productType.sizeChartImage,
          attributeVariants: productType.productTypeProductVariants.map(
            (x) => ({
              id: x.productAttributeId,
              order: x.order,
              name: x.productAttribute.name,
              value: _.uniqBy(
                attributeVariants.filter(
                  (y) => y.attributeId === x.productAttributeId,
                ),
                'value',
              ).map((z) => z.value),
            }),
          ),
        },
        variants: variants.map((variant) => ({
          ...variant,
          variantImages: variant.variantImages.map(
            (image) => image.productImageId,
          ),
          warehouseStocks: variant.warehouseStocks.map((warehouseStock) => ({
            ...warehouseStock,
            warehouse: warehouseStock.warehouse.name,
          })),
          attributes: attributeVariants.filter(
            (x) => x.variantId === variant.id,
          ),
        })),
      };

      return {
        data: formatedProductDetail,
      };
    } catch (err) {
      throw err;
    }
  }

  public async getRecommendationProducts(
    productId: string,
    getRecommendationProductsQueryDTO: GetRecommendationProductsQueryDTO,
  ) {
    try {
      // Check product exists
      const product = await this.productRepo.findOne({
        where: {
          id: parseInt(productId),
        },
      });

      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Destructor query
      const { limit, page } = getRecommendationProductsQueryDTO;

      // Get all recommendation products && total
      const [products, total] = await this.productRepo
        .createQueryBuilder('product')
        .where('product.id != :id', {
          id: parseInt(productId),
        })
        .andWhere('product.productTypeId = :productTypeId', {
          productTypeId: product.productTypeId,
        })
        .leftJoinAndSelect('product.defaultVariant', 'defaultVariant')
        .leftJoinAndSelect('product.productImages', 'productImages')
        .select([
          'product.id',
          'product.name',
          'product.price',
          'product.description',
          'product.createdAt',
          'productImages.image',
          'defaultVariant.id',
          'defaultVariant.name',
          'defaultVariant.price',
          'defaultVariant.sku',
        ])
        .orderBy('product.createdAt', 'DESC')
        .take(limit)
        .skip(limit * (page - 1))
        .getManyAndCount();

      return {
        data: {
          products: products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.productImages[0]?.image,
            defaultVariant: product.defaultVariant,
          })),
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async search(searchQueryDTO: SearchQueryDTO) {
    try {
      // Destructor query
      const { search, limit, page } = searchQueryDTO;

      const [products, total] = await this.productRepo.findAndCount({
        where: {
          name:
            search &&
            Raw((alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`),
        },
        select: ['id', 'name', 'price', 'description'],
        order: {
          name: 'ASC',
        },
        take: limit,
        skip: limit * (page - 1),
        relations: ['productImages', 'defaultVariant'],
      });

      const colorProducts = await this.getColorsOfProducts(
        products.map((product) => product.id),
      );

      return {
        data: {
          products: products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.productImages[0]?.image,
            defaultVariant: product?.defaultVariant?.id,
            colors: colorProducts[product.id],
          })),
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllProducts(getAllProductsQueryDto: GetAllProductsQueryDTO) {
    try {
      // Destructor query
      const { search, limit, page } = getAllProductsQueryDto;

      const [products, total] = await this.productRepo.findAndCount({
        where: {
          name:
            search &&
            Raw((alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`),
        },
        select: ['id', 'name', 'description'],
        order: {
          name: 'ASC',
        },
        take: limit,
        skip: limit * (page - 1),
        relations: ['productImages', 'productType'],
      });

      return {
        data: {
          products: products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.productImages[0]?.image,
            productType: product.productType.name,
          })),
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async createProduct(createProductBodyDTO: CreateProductBodyDTO) {
    try {
      // Destructor body
      const {
        productTypeId,
        categoryId,
        productName,
        productDescription,
        attributes,
      } = createProductBodyDTO;

      // Check product type exists
      const productType = await this.productTypeRepo.count({
        where: {
          id: productTypeId,
        },
      });
      if (!productType) {
        throw new CustomErrorException(ERRORS.ProductTypeNotExist);
      }

      // Check category exists
      const category = await this.categoryRepo.count({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        throw new CustomErrorException(ERRORS.CategoryNotExist);
      }

      // Check attributes belong to product type
      const productTypeAttributes = await this.productAttributeRepo.find({
        where: {
          productTypeProductAttribute: {
            productTypeId,
          },
        },
        select: ['id'],
        relations: ['attributeValues'],
      });

      if (
        _.xor(
          attributes.map((attribute) => attribute.id),
          productTypeAttributes.map((attribute) => attribute.id),
        ).length !== 0
      ) {
        throw new CustomErrorException(ERRORS.ProductAttributeNotBelongToType);
      }

      // Check attribute values belong to attribute
      attributes.forEach((attribute) => {
        const attributeValue = productTypeAttributes
          .filter((x) => x.id === attribute.id)[0]
          .attributeValues.filter((x) => x.id === attribute.valueId)[0];

        if (!attributeValue) {
          throw new CustomErrorException(
            ERRORS.ProductAttributeValueNotBelongToAttribute,
          );
        }
      });

      // Create product
      const createdProduct = await this.productRepo.save({
        productTypeId,
        categoryId,
        name: productName,
        description: productDescription,
        price: 0,
        weight: 0,
      });

      return {
        message: 'Create product successfully',
        data: createdProduct,
      };
    } catch (err) {
      throw err;
    }
  }

  public async deleteImage(imageId: string) {
    try {
      // Check image exists
      const image = await this.productImgRepo.count({
        where: {
          id: parseInt(imageId),
        },
      });

      if (!image) {
        throw new CustomErrorException(ERRORS.ImageNotExist);
      }

      // Check image belong to variant
      const imageBelongToVariant = await this.productVariantRepo.count({
        where: {
          variantImages: {
            productImageId: parseInt(imageId),
          },
        },
      });

      if (imageBelongToVariant) {
        throw new CustomErrorException(ERRORS.ImageBelongToVariant);
      }

      // Delete image
      await this.productImgRepo.delete({
        id: parseInt(imageId),
      });

      return {
        message: 'Delete image successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async bulkCreateImage(
    bulkCreateImageBodyDTO: BulkCreateImageBodyDTO,
    files: Express.Multer.File[],
  ) {
    try {
      // Destructor body
      const { productId } = bulkCreateImageBodyDTO;

      // Check product exists
      const product = await this.productRepo.count({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Check minimum image upload is 1
      if (files.length < 1) {
        throw new CustomErrorException(ERRORS.MinimumImageUploadIsOne);
      }

      // Get max order
      let { maxOrder } = await this.productImgRepo
        .createQueryBuilder('productImage')
        .where('productImage.productId = :id', {
          id: productId,
        })
        .select('MAX(productImage.order)', 'maxOrder')
        .getRawOne();

      if (!maxOrder) {
        maxOrder = -1;
      }

      // Upload images to S3
      const uploadedImages = await Promise.all(
        files.map((file, index) =>
          this.fileUploadSerivce.uploadFileToS3(
            file.buffer,
            this.getS3Key(productId, maxOrder + index + 1, file.originalname),
          ),
        ),
      );

      // Create product images
      const createdProductImages = await this.productImgRepo.save(
        uploadedImages.map((image, index) => ({
          productId,
          image,
          order: maxOrder + index + 1,
        })),
      );

      return {
        message: 'Create product images successfully',
        data: createdProductImages.map((image) => ({
          id: image.id,
          image: image.image,
          order: image.order,
        })),
      };
    } catch (err) {
      throw err;
    }
  }

  private getS3Key(productId: number, order: number, fileName: string): string {
    return `${this.configService.get<string>(
      'AWS_S3_PRODUCT_FOLDER',
    )}/${productId}-${order}-${Date.now()}-${fileName}`;
  }

  public async getDetailProductAdmin(productId: string) {
    try {
      const product = await this.productRepo
        .createQueryBuilder('product')
        .where('product.id = :id', {
          id: parseInt(productId),
        })
        .leftJoinAndSelect('product.productImages', 'images')
        .leftJoinAndSelect('product.productType', 'productType')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productVariants', 'variants')
        .leftJoinAndSelect('variants.warehouseStocks', 'stock')
        .leftJoinAndSelect('stock.warehouse', 'warehouse')
        .select([
          'product.id',
          'product.name',
          'product.description',
          'images.id',
          'images.image',
          'images.order',
          'productType.id',
          'productType.name',
          'category.id',
          'category.name',
          'variants.id',
          'variants.sku',
          'variants.name',
          'variants.order',
          'variants.price',
          'variants.weight',
          'stock.id',
          'stock.quantity',
          'warehouse.id',
          'warehouse.name',
        ])
        .getOne();

      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      return {
        data: product,
      };
    } catch (err) {
      throw err;
    }
  }

  public async getProductVariantAdmin(variantId: string) {
    try {
      const [variant, attributes, attributeValues] = await Promise.all([
        this.productVariantRepo
          .createQueryBuilder('variant')
          .where('variant.id = :id', {
            id: parseInt(variantId),
          })
          .leftJoinAndSelect('variant.variantImages', 'variantImages')
          .leftJoinAndSelect('variantImages.productImage', 'image')
          .leftJoinAndSelect('variant.warehouseStocks', 'stock')
          .leftJoinAndSelect('stock.warehouse', 'warehouse')
          .select([
            'variant.id',
            'variant.name',
            'variant.sku',
            'variant.price',
            'variant.order',
            'variant.weight',
            'variant.productId',
            'variantImages.id',
            'image.id',
            'image.image',
            'image.order',
            'stock.id',
            'stock.quantity',
            'warehouse.id',
            'warehouse.name',
          ])
          .getOne(),
        this.productAttributeRepo.find({
          where: {
            productTypeProductVariant: {
              assignedVariantAttributes: {
                variantId: parseInt(variantId),
              },
            },
          },
          select: ['id', 'name'],
          relations: ['attributeValues'],
        }),
        this.attributeValueRepo.find({
          where: {
            assignedVariantAttributeValues: {
              assignedVariantAttribute: {
                variantId: parseInt(variantId),
              },
            },
          },
          select: ['id', 'value', 'attributeId'],
        }),
      ]);

      if (!variant) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      return {
        data: {
          ...variant,
          attributes: attributes.map((attribute) => ({
            ...attribute,
            attributeValues: _.omit(
              attributeValues.filter(
                (value) => value.attributeId === attribute.id,
              )[0],
              'attributeId',
            ),
          })),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllImagesBelongToProduct(productId: string) {
    try {
      const product = await this.productRepo.count({
        where: {
          id: parseInt(productId),
        },
      });

      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Get all images
      const images = await this.productImgRepo.find({
        where: {
          productId: parseInt(productId),
        },
        select: ['id', 'image', 'order'],
      });

      return {
        data: images,
      };
    } catch (err) {
      throw err;
    }
  }
}
