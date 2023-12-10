import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto';
import * as bcrypt from 'bcrypt';
import { hashPassword, paginate } from '../../shared/utils';
import { AuthUser } from '../../shared/interfaces';
import * as _ from 'lodash';
import { FileUploadService } from '../../shared/services';
import { ConfigService } from '@nestjs/config';
import {
  GetAllGroupPermissionsQueryDTO,
  InviteStaffMemberDto,
  UpdateProfileDto,
} from './dto';
import { AccountActiveStatus } from '../../shared/enums';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private fileUploadSerivce: FileUploadService,
    private configService: ConfigService,
    private mailService: MailService,
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
          'phone',
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
      throw err;
    }
  }

  public async uploadAvatarUser(
    currentUser: AuthUser,
    file: Express.Multer.File,
  ) {
    try {
      // Upload user avatar to S3
      const uploadedImage = await this.fileUploadSerivce.uploadFileToS3(
        file.buffer,
        this.getS3Key(currentUser.id, file.originalname),
      );

      // Save avatar url to database
      await this.userRepo.update(
        {
          id: currentUser.id,
        },
        {
          avatar: uploadedImage,
        },
      );

      // Remove old avatar if exist
      if (currentUser.avatar) {
        console.log(this.extractFileDestFromImageUrl(currentUser.avatar));

        await this.fileUploadSerivce.removeFileFromS3(
          this.extractFileDestFromImageUrl(currentUser.avatar),
        );
      }

      return {
        message: 'Upload avatar successfully',
        data: {
          avatarUrl: uploadedImage,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async updateProfile(
    currentUser: AuthUser,
    updateProfileDto: UpdateProfileDto,
  ) {
    try {
      // Update profile
      await this.userRepo.update(
        {
          id: currentUser.id,
        },
        {
          ...updateProfileDto,
        },
      );

      return {
        message: 'Update profile successfully',
        data: {
          userId: currentUser.id,
          ...updateProfileDto,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async getAllStaffMembers(
    getAllGroupPermissionsQueryDTO: GetAllGroupPermissionsQueryDTO,
  ) {
    try {
      // Destructure query params
      const { accountActive, page, limit } = getAllGroupPermissionsQueryDTO;

      const [staffMembers, total] = await this.userRepo.findAndCount({
        where: {
          ...(accountActive && {
            isActive: accountActive === AccountActiveStatus.ACTIVE,
          }),
          isStaff: true,
        },
        select: ['id', 'email', 'firstName', 'lastName', 'isActive'],
        order: {
          lastName: 'ASC',
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        data: {
          staffMembers,
          pageInformation: paginate(limit, page, total),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async inviteStaffMember(inviteStaffMemberDto: InviteStaffMemberDto) {
    try {
      // Extract data from dto
      const { email, firstName, lastName } = inviteStaffMemberDto;

      const user = await this.findUserByEmail(email);
      if (user) {
        throw new CustomErrorException(ERRORS.EmailExisted);
      }

      // Gen password
      const password = this.generatePassword();

      // Create new user
      await this.userRepo.save({
        email,
        firstName,
        lastName,
        password,
        isStaff: true,
        isActive: true,
        dateJoined: new Date(),
      });

      // Send email to staff
      await this.mailService.sendUserStaffPassword(email, firstName, password);

      return {
        message: 'Invite staff member successfully',
        data: {
          email,
          firstName,
          lastName,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  private getS3Key(userId: number, fileName: string): string {
    return `${this.configService.get<string>(
      'AWS_S3_AVATAR_FOLDER',
    )}/${userId}-${Date.now()}-${fileName}`;
  }

  private extractFileDestFromImageUrl(imageUrl: string): string {
    return imageUrl.replace(`${this.fileUploadSerivce.getS3Url()}/`, '');
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
        'avatar',
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

  private generatePassword() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*#?&';
    const randomIndex = () => Math.floor(Math.random() * characters.length);

    // Select at least one letter, one digit, and one special character
    const validString =
      characters[randomIndex()] + // Letter
      characters[randomIndex() + 26] + // Digit
      characters[randomIndex() + 52] + // Special character
      characters.slice(0, 9); // 9 random characters

    // Randomize the string to create a random valid string
    const shuffledString = validString
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return shuffledString;
  }
}
