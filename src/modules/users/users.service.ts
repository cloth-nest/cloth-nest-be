import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '../../shared/utils';
import { AuthUser } from '../../shared/interfaces';
import * as _ from 'lodash';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  public async getProfile(currentUser: AuthUser) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: currentUser.id,
        },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'isSuperUser',
          'isStaff',
          'isActive',
          'dateJoined',
          'defaultBillingAddressId',
          'note',
          'avatar',
          'userPermission',
        ],
        relations: {
          defaultShippingAddress: true,
          profileShippingAddress: true,
          userPermission: {
            permission: true,
          },
        },
      });

      // Get code permission
      const userPermissionList = user.userPermission.map(
        (item) => item.permission.codeName,
      );

      // Remove userPermission field
      return {
        data: _.omit(
          {
            ...user,
            permissions: userPermissionList,
          },
          ['userPermission'],
        ),
      };
    } catch (err) {
      throw new CustomErrorException(ERRORS.InternalServerError);
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createNewUser(signUpDto: SignUpDto): Promise<User> {
    try {
      const { email, password, firstName, lastName } = signUpDto;

      const createdUser = this.userRepo.create({
        email,
        password,
        firstName,
        lastName,
        dateJoined: new Date(),
      });
      await this.userRepo.save(createdUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  public async activateAccount(email: string): Promise<void> {
    await this.userRepo.update(
      {
        email,
      },
      {
        isActive: true,
      },
    );
  }

  public async isValidPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Unhash & check password
    return await bcrypt.compare(password, hashedPassword);
  }

  public async saveRefreshToken(rt: string, userId: number) {
    return await this.userRepo.update(
      {
        id: userId,
      },
      {
        refreshToken: rt,
      },
    );
  }

  public async removeRefreshToken(userId: number) {
    return await this.userRepo.update(
      {
        id: userId,
      },
      {
        refreshToken: '',
      },
    );
  }

  public async resetPassword(userId: number, newPassword: string) {
    return await this.userRepo.update(
      {
        id: userId,
      },
      {
        password: await hashPassword(newPassword),
      },
    );
  }

  public async getAuthenticatedUser(userId: number): Promise<AuthUser> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      select: [
        'id',
        'email',
        'lastName',
        'firstName',
        'password',
        'isSuperUser',
        'isStaff',
        'isActive',
        'dateJoined',
        'userPermission',
      ],
      relations: {
        defaultShippingAddress: true,
        profileShippingAddress: true,
        userPermission: {
          permission: true,
        },
      },
    });

    // Get code permission
    const userPermissionList = user.userPermission.map(
      (item) => item.permission.codeName,
    );

    // Remove userPermission field
    return _.omit(
      {
        ...user,
        permissions: userPermissionList,
      },
      ['userPermission'],
    );
  }
}
