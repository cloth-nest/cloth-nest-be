import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttributeValue,
  Category,
  Product,
  ProductAttribute,
  ProductImage,
  ProductType,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
  ProductVariant,
  Review,
  VariantImage,
  Warehouse,
  WarehouseStock,
} from '../../entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductTypeModule } from './product-type/product-type.module';
import { FileUploadService } from '../../shared/services';

@Module({
  imports: [
    ProductTypeModule,
    TypeOrmModule.forFeature([
      ProductAttribute,
      AttributeValue,
      Category,
      Product,
      ProductType,
      ProductImage,
      ProductVariant,
      ProductTypeProductAttribute,
      Warehouse,
      WarehouseStock,
      VariantImage,
      ProductTypeProductVariant,
      Review,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, FileUploadService],
  exports: [ProductService],
})
export class ProductModule {}
