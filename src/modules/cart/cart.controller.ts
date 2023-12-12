import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllCartItem(@CurrentUser() user: AuthUser) {
    return this.cartService.getAllCartItem(user);
  }
}
