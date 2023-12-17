import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { OrderService } from './order.service';
import {
  CalcBillBodyDto,
  CreateOrderWithCartBodyDto,
  GetAllOrdersBelongToUserQueryDTO,
  GetOrderDetailParamDto,
} from './dto';

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

  @Auth()
  @Get('/check-inventory')
  @HttpCode(HttpStatus.OK)
  checkInventory(@CurrentUser() user: AuthUser) {
    return this.orderService.checkInventory(user);
  }

  @Auth()
  @Post('/calc-bill')
  @HttpCode(HttpStatus.OK)
  calcBill(
    @CurrentUser() user: AuthUser,
    @Body() calcBillBodyDto: CalcBillBodyDto,
  ) {
    return this.orderService.calcBill(user, calcBillBodyDto);
  }

  @Auth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOrderDetail(
    @CurrentUser() user: AuthUser,
    @Param() getOrderDetailParamDto: GetOrderDetailParamDto,
  ) {
    return this.orderService.getOrderDetail(user, getOrderDetailParamDto.id);
  }

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createOrderWithCart(
    @CurrentUser() user: AuthUser,
    @Body() createOrderWithCartBodyDto: CreateOrderWithCartBodyDto,
  ) {
    return this.orderService.createOrderWithCart(
      user,
      createOrderWithCartBodyDto,
    );
  }
}
