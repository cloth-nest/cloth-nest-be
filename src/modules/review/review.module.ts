import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Review, ReviewImage } from '../../entities';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { FileUploadService } from '../../shared/services';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewImage, Product])],
  controllers: [ReviewController],
  providers: [ReviewService, FileUploadService],
  exports: [ReviewService],
})
export class ReviewModule {}
