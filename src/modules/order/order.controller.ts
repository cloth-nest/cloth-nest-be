import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { OrderService } from './order.service';
import { GetAllOrdersBelongToUserQueryDTO } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllOrderBelongToUser(
    @CurrentUser() user: AuthUser,
    @Query() getAllOrderBelongToUserQueryDTO: GetAllOrdersBelongToUserQueryDTO,
  ) {
    return this.orderService.getAllOrderBelongToUser(
      user,
      getAllOrderBelongToUserQueryDTO,
    );
  }
}
