import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllWishlistItem(@CurrentUser() user: AuthUser) {
    return this.wishlistService.getAllWishlistItem(user);
  }
}
