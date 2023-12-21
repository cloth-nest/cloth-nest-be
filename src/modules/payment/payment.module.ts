import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentContext } from './payment.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'PaymentContext',
      useClass: PaymentContext,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
