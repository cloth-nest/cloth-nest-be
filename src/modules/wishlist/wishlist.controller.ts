import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { WishlistService } from './wishlist.service';
import {
  AddWishlistItemsBodyDto,
  RemoveWishlistItemsBodyDto,
  SyncWishlistItemsBodyDto,
} from './dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllWishlistItem(@CurrentUser() user: AuthUser) {
    return this.wishlistService.getAllWishlistItem(user);
  }

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  addWishlistItems(
    @CurrentUser() user: AuthUser,
    @Body() addWishlistItemsBodyDto: AddWishlistItemsBodyDto,
  ) {
    return this.wishlistService.addWishlistItems(user, addWishlistItemsBodyDto);
  }

  @Auth()
  @Patch('')
  @HttpCode(HttpStatus.OK)
  syncWishlistItems(
    @CurrentUser() user: AuthUser,
    @Body() syncWishlistItemsBodyDto: SyncWishlistItemsBodyDto,
  ) {
    return this.wishlistService.syncWishlistItems(
      user,
      syncWishlistItemsBodyDto,
    );
  }

  @Auth()
  @Delete('')
  @HttpCode(HttpStatus.OK)
  removeWishlistItems(
    @CurrentUser() user: AuthUser,
    @Body() removeWishlistItemsBodyDto: RemoveWishlistItemsBodyDto,
  ) {
    return this.wishlistService.removeWishlistItems(
      user,
      removeWishlistItemsBodyDto,
    );
  }
}
