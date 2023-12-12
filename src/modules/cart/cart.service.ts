import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant, User } from '../../entities';
import { DataSource, Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}
  public async getAllCartItem(user: AuthUser) {
    try {
      const cartItems = await this.productVariantRepo
        .createQueryBuilder('pv')
        .leftJoinAndSelect('pv.cart', 'cart')
        .where('cart.userId = :userId', { userId: user.id })
        .leftJoinAndSelect('pv.variantImages', 'variantImages')
        .leftJoinAndSelect('variantImages.productImage', 'productImage')
        .select([
          'pv.id',
          'pv.name',
          'pv.price',
          'pv.productId',
          'cart.quantity',
          'variantImages.id',
          'productImage.image',
        ])
        .orderBy('cart.createdAt', 'DESC')
        .getMany();

      return {
        data: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.cart[0].quantity,
          image: item.variantImages[0].productImage.image,
        })),
      };
    } catch (err) {
      throw err;
    }
  }
}
