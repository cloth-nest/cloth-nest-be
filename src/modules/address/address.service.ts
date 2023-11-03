import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, User, UserAddress } from '../../entities';
import { Repository } from 'typeorm';
import { AuthUser } from '../../shared/interfaces';
import * as _ from 'lodash';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepo: Repository<UserAddress>,
  ) {}

  public async createAddress(
    currentUser: AuthUser,
    createAddressDto: CreateAddressDto,
  ) {
    try {
      /**
       * Step 1: Create new address
       * Two case:
       * 1. Create address profile
       * - If user don't have profile address then create & set default
       * - If user have profile address then reject
       * 2. Create address user
       * - Check count of address user (max 10)
       * - If greater than 10 then reject, else create new address
       * Step 2: Save central table
      .*/

      const { isAddressProfile } = createAddressDto;

      let createdAddress: Address = undefined;

      if (isAddressProfile) {
        if (currentUser.profileShippingAddress) {
          throw new CustomErrorException(ERRORS.AddressProfileExist);
        }

        // Create profile address
        createdAddress = await this.addressRepo.save(
          this.addressRepo.create(createAddressDto),
        );

        // Assign address to user
        await this.userRepo.save({
          id: currentUser.id,
          profileShippingAddress: createdAddress,
          // If user don't have defaultShippingAddress then assign profileShippingAddress to defaultShippingAddress
          defaultShippingAddress: currentUser.defaultShippingAddress
            ? currentUser.defaultShippingAddress
            : createdAddress,
        });
      } else {
        // Count of address user
        const countAddress = await this.userAddressRepo.count({
          where: { userId: currentUser.id },
        });

        // Check address user count of user (max 10)
        if (
          (countAddress >= 11 && currentUser.profileShippingAddress) ||
          (countAddress >= 10 && !currentUser.profileShippingAddress)
        ) {
          throw new CustomErrorException(
            ERRORS.UserAddressMustBeLessThanOrEqual10,
          );
        }

        // Create address
        createdAddress = await this.addressRepo.save(
          this.addressRepo.create(createAddressDto),
        );
      }

      // Save central table
      await this.userAddressRepo.save({
        userId: currentUser.id,
        addressId: createdAddress.id,
      });

      return {
        message: 'Add new address successfully',
        data: _.omit(createdAddress, ['createdAt', 'updatedAt']),
      };
    } catch (err) {
      throw err;
    }
  }

  public async getAllAddressesBelongToUser(currentUser: AuthUser) {
    try {
      // Get all address belong to user
      const userAddresses = await this.userRepo.findOne({
        where: {
          id: currentUser.id,
        },
        relations: {
          userAddress: {
            address: true,
          },
        },
      });

      const formatedData = userAddresses.userAddress.map((item) => {
        return _.omit(item.address, ['createdAt', 'updatedAt']);
      });

      return {
        data: formatedData,
      };
    } catch (err) {
      throw err;
    }
  }

  public async getOneAddressBelongToUser(
    currentUser: AuthUser,
    addressId: string,
  ) {
    try {
      // Check addressId belong to user
      const userAddress = await this.userAddressRepo.findOne({
        where: {
          userId: currentUser.id,
          addressId: parseInt(addressId),
        },
      });

      if (!userAddress) {
        throw new CustomErrorException(ERRORS.AddressNotExist);
      }

      const address = await this.addressRepo.findOne({
        where: {
          id: parseInt(addressId),
        },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'provinceCode',
          'districtName',
          'districtCode',
          'districtName',
          'wardCode',
          'wardName',
          'detail',
          'phone',
        ],
      });

      return {
        data: address,
      };
    } catch (err) {
      throw err;
    }
  }
}
