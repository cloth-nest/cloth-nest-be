import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, ProductVariant } from '../../entities';
import { Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import { AddToCartBodyDto } from './dto';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import * as _ from 'lodash';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
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

  public async addToCart(user: AuthUser, addToCartBodyDto: AddToCartBodyDto) {
    try {
      const { variantId, quantity } = addToCartBodyDto;
      const productVariant = await this.productVariantRepo.count({
        where: { id: variantId },
      });
      if (!productVariant) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      // Check productVariant is in cart
      const cartItemExist = await this.cartRepo.findOne({
        where: { userId: user.id, productVariantId: variantId },
        select: ['id', 'productVariantId', 'quantity'],
      });

      // If productVariant is in cart, update quantity
      if (cartItemExist) {
        const cartItem = await this.cartRepo.save({
          id: cartItemExist.id,
          userId: user.id,
          productVariantId: variantId,
          quantity: cartItemExist.quantity + quantity,
        });

        return {
          data: {
            productVariantId: cartItem.productVariantId,
            quantity: cartItem.quantity,
          },
        };
      }

      const cartItem = await this.cartRepo.save({
        userId: user.id,
        productVariantId: variantId,
        quantity,
      });

      return {
        message: 'Add to cart successfully',
        data: _.pick(cartItem, ['productVariantId', 'quantity']),
      };
    } catch (err) {
      throw err;
    }
  }
}
