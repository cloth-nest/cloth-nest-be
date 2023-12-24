import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { FileUploadService } from '../../../shared/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductAttribute,
      AttributeValue,
      ProductType,
      ProductTypeProductAttribute,
      ProductTypeProductVariant,
      AssignedProductAttribute,
      AssignedVariantAttribute,
      Product,
    ]),
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, FileUploadService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
