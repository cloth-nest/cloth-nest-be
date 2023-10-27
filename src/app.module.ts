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
