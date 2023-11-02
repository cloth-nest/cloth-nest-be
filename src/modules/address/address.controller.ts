import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Auth()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  createAddress(
    @CurrentUser() user: AuthUser,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(user, createAddressDto);
  }
}
