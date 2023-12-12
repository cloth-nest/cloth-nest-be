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
import { CartService } from './cart.service';
import { AddToCartBodyDto, RemoveCartItemBodyDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllCartItem(@CurrentUser() user: AuthUser) {
    return this.cartService.getAllCartItem(user);
  }

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  addToCart(
    @CurrentUser() user: AuthUser,
    @Body() addToCartBodyDto: AddToCartBodyDto,
  ) {
    return this.cartService.addToCart(user, addToCartBodyDto);
  }

  @Auth()
  @Delete('')
  @HttpCode(HttpStatus.OK)
  removeCartItem(
    @CurrentUser() user: AuthUser,
    @Body() removeCartItemBodyDto: RemoveCartItemBodyDto,
  ) {
    return this.cartService.removeCartitem(user, removeCartItemBodyDto);
  }
}
