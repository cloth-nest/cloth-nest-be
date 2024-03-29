import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import {
  GetProductRecommendationParamDTO,
  GetProductRecommendationQueryDTO,
} from './dto';
import { Auth } from '../../shared/decorators';
import { Permission } from '../../shared/enums';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':id')
  getProductRecommendation(
    @Param() getProductRecommendationParamDTO: GetProductRecommendationParamDTO,
    @Query() getProductRecommendationQueryDTO: GetProductRecommendationQueryDTO,
  ) {
    return this.recommendationService.getProductRecommendation(
      getProductRecommendationParamDTO.id,
      getProductRecommendationQueryDTO,
    );
  }

  @Auth(Permission.MANAGE_SYNC_RECOMMENDATION)
  @Post('sync')
  syncProductRecommendation() {
    return this.recommendationService.syncProductRecommendation();
  }
}
