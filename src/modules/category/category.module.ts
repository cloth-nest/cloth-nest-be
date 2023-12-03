import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Product } from '../../entities';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { FileUploadService } from '../../shared/services';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoryController],
  providers: [CategoryService, FileUploadService],
  exports: [CategoryService],
})
export class CategoryModule {}
