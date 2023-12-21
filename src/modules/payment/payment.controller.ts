import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfirmOrderPaymentSuccessQueryDto, MakePaymentParamDto } from './dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  makePayment(@Param() makePaymentParamDto: MakePaymentParamDto) {
    return this.paymentService.makePayment(makePaymentParamDto.id);
  }

  @Get('/confirm-zalo-payment')
  @HttpCode(HttpStatus.OK)
  confirmOrderPaymentSuccess(
    @Query()
    confirmOrderPaymentSuccessQueryDto: ConfirmOrderPaymentSuccessQueryDto,
  ) {
    return this.paymentService.confirmOrderPaymentSuccess(
      confirmOrderPaymentSuccessQueryDto.apptransid,
    );
  }
}
