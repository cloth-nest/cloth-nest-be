import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { AddressService } from './address.service';
import { CreateAddressDto, FindOneAddressParams } from './dto';

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

  @Auth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllAddressesBelongToUser(@CurrentUser() user: AuthUser) {
    return this.addressService.getAllAddressesBelongToUser(user);
  }

  @Auth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneAddressBelongToUser(
    @CurrentUser() user: AuthUser,
    @Param() params: FindOneAddressParams,
  ) {
    return this.addressService.getOneAddressBelongToUser(user, params.id);
  }
}
