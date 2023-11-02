import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, User, UserAddress } from '../../entities';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, UserAddress])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
