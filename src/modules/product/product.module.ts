import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValue, ProductAttribute } from '../../entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductTypeModule } from './product-type/product-type.module';

@Module({
  imports: [
    ProductTypeModule,
    TypeOrmModule.forFeature([ProductAttribute, AttributeValue]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
