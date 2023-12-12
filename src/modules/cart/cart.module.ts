import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, ProductVariant, User } from '../../entities';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, ProductVariant])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
