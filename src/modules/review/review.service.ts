import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Review, ReviewImage } from '../../entities';
import { GetAllReviewsBelongToProductQueryDTO } from './dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { paginate } from '../../shared/utils';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepo: Repository<ReviewImage>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
}
