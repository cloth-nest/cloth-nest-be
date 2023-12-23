import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
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
    ]),
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
