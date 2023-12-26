import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  appConfig,
  cacheConfig,
  dbConfig,
  jwtConfig,
  mailerConfig,
  devtoolConfig,
  awsConfig,
} from './configs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { MailModule } from './modules/mail/mail.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';
import { GlobalModule } from './modules/global/global.module';
import { AddressModule } from './modules/address/address.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PermissionModule } from './modules/permission/permission.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { StatisticModule } from './modules/statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        dbConfig,
        jwtConfig,
        mailerConfig,
        cacheConfig,
        devtoolConfig,
        awsConfig,
      ],
    }),
    DevtoolsModule.registerAsync({
      useFactory: async (config: ConfigService) => config.get('devtool'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => config.get('cache'), // Miliseconds
      inject: [ConfigService],
      isGlobal: true,
    }),
    GlobalModule,
    MailModule,
    AuthModule,
    AddressModule,
    CategoryModule,
    ProductModule,
    PermissionModule,
    WishlistModule,
    CartModule,
    OrderModule,
    PaymentModule,
    WarehouseModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
