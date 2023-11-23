import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { AttributeValue, ProductAttribute } from '../../entities';
import { paginate } from '../../shared/utils';
import { GetAllAttributeQueryDTO } from './dto';

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
            name: Raw(
              (alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`,
            ),
          },
          select: ['id', 'name'],
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
}
