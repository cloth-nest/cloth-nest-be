import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../../shared/decorators';
import {
  GetAllReviewsBelongToProductParamDTO,
  GetAllReviewsBelongToProductQueryDTO,
} from './dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Get('product/:id')
  @HttpCode(HttpStatus.OK)
  getAllReviewsBelongToProduct(
    @Param()
    getAllReviewsBelongToProductParamDTO: GetAllReviewsBelongToProductParamDTO,
    @Query()
    getAllReviewsBelongToProductQueryDTO: GetAllReviewsBelongToProductQueryDTO,
  ) {
    return this.reviewService.getAllReviewsBelongToProduct(
      getAllReviewsBelongToProductParamDTO.id,
      getAllReviewsBelongToProductQueryDTO,
    );
  }
}
