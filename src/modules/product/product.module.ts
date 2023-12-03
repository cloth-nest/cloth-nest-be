import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttributeValue,
  Category,
  Product,
  ProductAttribute,
  ProductType,
} from '../../entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductTypeModule } from './product-type/product-type.module';

@Module({
  imports: [
    ProductTypeModule,
    TypeOrmModule.forFeature([
      ProductAttribute,
      AttributeValue,
      Category,
      Product,
      ProductType,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
