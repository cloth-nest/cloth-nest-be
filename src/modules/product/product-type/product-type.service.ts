import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import {
  AttributeValue,
  ProductAttribute,
  ProductType,
} from '../../../entities';
import { GetAllProductTypeQueryDTO } from './dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepo: Repository<ProductAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(ProductType)
    private productTypeRepo: Repository<ProductType>,
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
          pageInformation: {
            limit,
            page,
            total,
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
