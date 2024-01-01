import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, Review, ReviewImage } from '../../entities';
import {
  CreateReviewBodyDTO,
  GetAllReviewsBelongToProductQueryDTO,
} from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { paginate } from '../../shared/utils';
import { AuthUser } from '../../shared/interfaces';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from '../../shared/services';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepo: Repository<ReviewImage>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private fileUploadSerivce: FileUploadService,
  ) {}

  async getAllReviewsBelongToProduct(
    productId: string,
    getAllReviewsBelongToProductQueryDTO: GetAllReviewsBelongToProductQueryDTO,
  ) {
    try {
      // Check if product exists
      const product = await this.productRepo.count({
        where: { id: parseInt(productId) },
      });
      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Destruct query
      const { page, limit } = getAllReviewsBelongToProductQueryDTO;

      // Get reviews
      const [reviews, total] = await this.reviewRepo
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.images', 'images')
        .leftJoinAndSelect('review.user', 'user')
        .select([
          'review.id',
          'review.content',
          'review.rating',
          'review.createdAt',
          'user.id',
          'user.email',
          'user.avatar',
          'user.firstName',
          'user.lastName',
          'images.id',
          'images.image',
        ])
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('review.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: {
          reviews,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getReviewDetail(reviewId: string) {
    try {
      // Check if review exists
      const review = await this.reviewRepo.findOne({
        where: { id: parseInt(reviewId) },
      });
      if (!review) {
        throw new CustomErrorException(ERRORS.ReviewNotExist);
      }

      // Get review detail
      const reviewDetail = await this.reviewRepo
        .createQueryBuilder('review')
        .where('review.id = :reviewId', { reviewId: parseInt(reviewId) })
        .leftJoinAndSelect('review.images', 'images')
        .leftJoinAndSelect('review.user', 'user')
        .select([
          'review.id',
          'review.content',
          'review.rating',
          'review.createdAt',
          'user.id',
          'user.email',
          'user.avatar',
          'user.firstName',
          'user.lastName',
          'images.id',
          'images.image',
        ])
        .getOne();

      return {
        data: reviewDetail,
      };
    } catch (err) {
      throw err;
    }
  }

  async createReview(
    user: AuthUser,
    productId: string,
    createReviewBodyDTO: CreateReviewBodyDTO,
    files: Express.Multer.File[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check if product exists
      const product = await this.productRepo.count({
        where: { id: parseInt(productId) },
      });
      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Check minimum image upload is 1
      if (files.length < 1) {
        throw new CustomErrorException(ERRORS.MinimumImageUploadIsOne);
      }

      // Destruct body
      const { reviewContent, rating } = createReviewBodyDTO;

      // Create review
      const review = await queryRunner.manager.save(Review, {
        content: reviewContent,
        rating,
        user,
        product: { id: parseInt(productId) },
      });

      // Upload images to S3
      const uploadedImages = await Promise.all(
        files.map((file, index) =>
          this.fileUploadSerivce.uploadFileToS3(
            file.buffer,
            this.getS3Key(review.id, user.id, index, file.originalname),
          ),
        ),
      );

      // Create review images
      await queryRunner.manager.save(
        ReviewImage,
        uploadedImages.map((image, index) => ({
          image,
          order: index,
          review,
        })),
      );

      await queryRunner.commitTransaction();
      return {
        message: 'Create review successfully',
        data: {
          reviewId: review.id,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private getS3Key(
    reviewId: number,
    userId: number,
    orderId: number,
    fileName: string,
  ): string {
    return `${this.configService.get<string>(
      'AWS_S3_REVIEW_FOLDER',
    )}/${reviewId}-${userId}-${orderId}-${Date.now()}-${fileName}`;
  }
}
