import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant, User, UserWishlist } from '../../entities';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserWishlist, ProductVariant])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
