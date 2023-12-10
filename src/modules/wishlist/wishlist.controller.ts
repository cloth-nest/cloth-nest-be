import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemsBodyDto, RemoveWishlistItemsBodyDto } from './dto';

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
