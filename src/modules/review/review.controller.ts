import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth, CurrentUser } from '../../shared/decorators';
import {
  GetAllReviewsBelongToProductParamDTO,
  GetAllReviewsBelongToProductQueryDTO,
  CreateReviewBodyDTO,
  GetReviewDetailParamDTO,
} from './dto';
import { AuthUser } from '../../shared/interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extensionImageReg } from '../../shared/constants';

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

  @Auth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getReviewDetail(
    @Param()
    getReviewDetailParamDTO: GetReviewDetailParamDTO,
  ) {
    return this.reviewService.getReviewDetail(getReviewDetailParamDTO.id);
  }

  @Auth()
  @Post('product/:id')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 8))
  createReview(
    @CurrentUser() user: AuthUser,
    @Param()
    getAllReviewsBelongToProductParamDTO: GetAllReviewsBelongToProductParamDTO,
    @Body()
    createReviewBodyDTO: CreateReviewBodyDTO,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: extensionImageReg,
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    return this.reviewService.createReview(
      user,
      getAllReviewsBelongToProductParamDTO.id,
      createReviewBodyDTO,
      files,
    );
  }
}
