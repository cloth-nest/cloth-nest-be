import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant, User, UserWishlist } from '../../entities';
import { DataSource, Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserWishlist)
    private userWishlistRepo: Repository<UserWishlist>,
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}
  public async getAllWishlistItem(user: AuthUser) {
    try {
      const wishlistItems = await this.productVariantRepo
        .createQueryBuilder('pv')
        .leftJoinAndSelect('pv.userWishlist', 'wishlist')
        .where('wishlist.userId = :userId', { userId: user.id })
        .leftJoinAndSelect('pv.variantImages', 'variantImages')
        .leftJoinAndSelect('variantImages.productImage', 'productImage')
        .select([
          'pv.id',
          'pv.name',
          'pv.price',
          'pv.productId',
          'variantImages.id',
          'productImage.image',
        ])
        .getMany();

      return {
        data: wishlistItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          image: item.variantImages[0].productImage.image,
        })),
      };
    } catch (err) {
      throw err;
    }
  }
}
