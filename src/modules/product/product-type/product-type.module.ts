import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttributeValue,
  ProductAttribute,
  ProductType,
} from '../../../entities';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAttribute, AttributeValue, ProductType]),
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
