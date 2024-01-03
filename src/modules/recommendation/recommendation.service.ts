import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { GetProductRecommendationQueryDTO } from './dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getProductRecommendation(
    productId: string,
    getProductRecommendationQueryDTO: GetProductRecommendationQueryDTO,
  ) {
    try {
      // Destruct query
      const { count } = getProductRecommendationQueryDTO;

      // Check product exist
      const product = await this.productRepo.count({
        where: { id: parseInt(productId) },
      });
      if (!product) {
        throw new CustomErrorException(ERRORS.ProductNotExist);
      }

      // Get product recommendation
      const rcmProductRoute =
        this.configService.get<string>('RECOMMENDATION_BASE_URL') +
        `/product/recommend/${productId}`;
      const { data }: { data: number[] } = await firstValueFrom(
        this.httpService
          .get(rcmProductRoute, {
            params: {
              count,
            },
          })
          .pipe(
            catchError((err) => {
              const errData = err.response.data;
              const code = errData.error.code;
              switch (code) {
                case 'R01':
                  throw new CustomErrorException(
                    ERRORS.RecomendationSystemError,
                  );
                default:
                  throw new CustomErrorException(ERRORS.InternalServerError);
              }
            }),
          ),
      );

      // Get product recommendation
      const products = await this.productRepo
        .createQueryBuilder('product')
        .whereInIds(data)
        .leftJoinAndSelect('product.defaultVariant', 'defaultVariant')
        .leftJoinAndSelect('product.productImages', 'productImages')
        .select([
          'product.id',
          'product.name',
          'product.price',
          'product.description',
          'product.createdAt',
          'productImages.image',
          'defaultVariant.id',
        ])
        .getMany();

      // Order by recommendation
      const sortMap = data
        .map((id: number) => products.find((product) => product.id === id))
        .filter((product) => product !== undefined);

      return {
        data: sortMap.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.productImages[0]?.image,
          defaultVariantId: product.defaultVariant.id,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  async syncProductRecommendation() {
    try {
      // Get all products
      const products = await this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productImages', 'productImages')
        .select(['product.id', 'productImages.image', 'productImages.order'])
        .getMany();

      const inputProducts = products
        .map((product) => ({
          id: product.id,
          image_url: product.productImages.find(
            (productImage) => productImage.order === 0,
          )?.image,
        }))
        .filter((product) => product.image_url !== undefined);

      const syncProductRoute =
        this.configService.get<string>('RECOMMENDATION_BASE_URL') +
        '/product/recommend/catalog?sync=true';
      await firstValueFrom(
        this.httpService.post(syncProductRoute, inputProducts).pipe(
          catchError((err) => {
            const errData = err.response.data;
            const code = errData.error.code;
            switch (code) {
              case 'R01':
                throw new CustomErrorException(ERRORS.RecomendationSystemError);
              default:
                throw new CustomErrorException(ERRORS.InternalServerError);
            }
          }),
        ),
      );

      return {
        message: 'Sync product recommendation successfully',
        data: inputProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  // Run cron job at 7:30 AM everyday
  @Cron('0 30 07 * * *')
  async handleSyncProductRecommendation() {
    try {
      // Log start
      Logger.log(
        'Start sync product recommendation',
        RecommendationService.name,
      );

      // Get all products created today
      const products = await this.productRepo
        .createQueryBuilder('product')
        .where('product.createdAt >= :date', {
          date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        })
        .leftJoinAndSelect('product.productImages', 'productImages')
        .select(['product.id', 'productImages.image', 'productImages.order'])
        .getMany();

      const inputProducts = products
        .map((product) => ({
          id: product.id,
          image_url: product.productImages.find(
            (productImage) => productImage.order === 0,
          )?.image,
        }))
        .filter((product) => product.image_url !== undefined);

      // Skip if no product created today
      if (inputProducts.length === 0) {
        Logger.log('No product created today', RecommendationService.name);
        return;
      }

      // Sync product recommendation -> Add new product to recommendation system
      const syncProductRoute =
        this.configService.get<string>('RECOMMENDATION_BASE_URL') +
        '/product/recommend/catalog';
      await firstValueFrom(
        this.httpService.post(syncProductRoute, inputProducts).pipe(
          catchError((err) => {
            const errData = err.response.data;
            const code = errData.error.code;
            switch (code) {
              case 'R01':
                throw new CustomErrorException(ERRORS.RecomendationSystemError);
              default:
                throw new CustomErrorException(ERRORS.InternalServerError);
            }
          }),
        ),
      );

      Logger.log(
        'Sync product recommendation successfully',
        RecommendationService.name,
      );
    } catch (error) {
      Logger.error(error.name, error.stack, RecommendationService.name);
    }
  }
}
