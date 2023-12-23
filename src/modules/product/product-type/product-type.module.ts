import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AssignedProductAttribute,
  AssignedVariantAttribute,
  AttributeValue,
  ProductAttribute,
  ProductType,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
} from '../../../entities';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';

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
    ]),
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
