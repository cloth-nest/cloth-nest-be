import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant, User, UserWishlist } from '../../entities';
import { DataSource, In, Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import {
  AddWishlistItemsBodyDto,
  RemoveWishlistItemsBodyDto,
  SyncWishlistItemsBodyDto,
} from './dto';
import { hasDuplicates } from '../../shared/utils';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as _ from 'lodash';

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
          'wishlist.productVariantId',
          'variantImages.id',
          'productImage.image',
        ])
        .orderBy('wishlist.createdAt', 'DESC')
        .getMany();

      return {
        data: wishlistItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          productVariantId: item.userWishlist[0].productVariantId,
          image: item.variantImages[0].productImage.image,
        })),
      };
    } catch (err) {
      throw err;
    }
  }

  public async addWishlistItems(
    user: AuthUser,
    addWishlistItemsBodyDto: AddWishlistItemsBodyDto,
  ) {
    try {
      const { variantIds } = addWishlistItemsBodyDto;

      // 1. Mỗi user có tối đa 10 sản phẩm trong wishlist
      // 2. Mỗi sản phẩm chỉ được thêm 1 lần
      // 3. Nếu sản phẩm đã có trong wishlist thì không được thêm nữa

      // Check duplicate productVariantIds
      const hasDuplicateProductVariantIds = hasDuplicates(variantIds);
      if (hasDuplicateProductVariantIds) {
        throw new CustomErrorException(ERRORS.DuplicateProductVariantIds);
      }

      // Check if productVariantIds is existed
      const productVariants = await this.productVariantRepo.count({
        where: {
          id: In(variantIds),
        },
      });
      if (productVariants !== variantIds.length) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      // Check productVariant is existed in wishlist
      const countedWishlistItemsExist = await this.userWishlistRepo.count({
        where: {
          userId: user.id,
          productVariantId: In(variantIds),
        },
      });
      if (countedWishlistItemsExist > 0) {
        throw new CustomErrorException(ERRORS.ProductVariantAlreadyExist);
      }

      // Check if user has 10 items in wishlist
      const countedWishlistItems = await this.userWishlistRepo.count({
        where: {
          userId: user.id,
        },
      });
      if (countedWishlistItems + variantIds.length > 10) {
        throw new CustomErrorException(ERRORS.WishlistItemLimit);
      }

      // Add wishlist items
      const createdWishlistItems = await this.userWishlistRepo.save(
        variantIds.map((variantId) => ({
          userId: user.id,
          productVariantId: variantId,
        })),
      );

      return {
        message: 'Add wishlist items successfully',
        data: createdWishlistItems.map((item) =>
          _.omit(item, ['createdAt', 'updatedAt']),
        ),
      };
    } catch (err) {
      throw err;
    }
  }

  public async syncWishlistItems(
    user: AuthUser,
    syncWishlistItemsBodyDto: SyncWishlistItemsBodyDto,
  ) {
    try {
      const { variantIds } = syncWishlistItemsBodyDto;

      // Check if productVariantIds is existed
      const productVariants = await this.productVariantRepo.count({
        where: {
          id: In(variantIds),
        },
      });
      if (productVariants !== variantIds.length) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      // Compare wishlist items
      const wishlistItems = await this.userWishlistRepo.find({
        where: {
          userId: user.id,
          productVariantId: In(variantIds),
        },
      });

      const needToAddWishlistItems = variantIds.filter(
        (variantId) =>
          !wishlistItems.some((item) => item.productVariantId === variantId),
      );

      // Add wishlist items
      const createdWishlistItems = await this.userWishlistRepo.save(
        needToAddWishlistItems.map((variantId) => ({
          userId: user.id,
          productVariantId: variantId,
        })),
      );

      return {
        message: 'Sync wishlist items successfully',
        data: createdWishlistItems.map((item) =>
          _.omit(item, ['createdAt', 'updatedAt']),
        ),
      };
    } catch (err) {
      throw err;
    }
  }

  public async removeWishlistItems(
    user: AuthUser,
    removeWishlistItemsBodyDto: RemoveWishlistItemsBodyDto,
  ) {
    try {
      const { variantIds } = removeWishlistItemsBodyDto;

      // Check duplicate productVariantIds
      const hasDuplicateProductVariantIds = hasDuplicates(variantIds);
      if (hasDuplicateProductVariantIds) {
        throw new CustomErrorException(ERRORS.DuplicateProductVariantIds);
      }

      // Check if productVariantIds must be existed in wishlist
      const countedWishlistItemsExist = await this.userWishlistRepo.count({
        where: {
          productVariantId: In(variantIds),
        },
      });
      if (countedWishlistItemsExist !== variantIds.length) {
        throw new CustomErrorException(ERRORS.ProductVariantNotExist);
      }

      // Remove wishlist items
      await this.userWishlistRepo.delete({
        userId: user.id,
        productVariantId: In(variantIds),
      });

      return {
        message: 'Remove wishlist items successfully',
      };
    } catch (err) {
      throw err;
    }
  }
}
