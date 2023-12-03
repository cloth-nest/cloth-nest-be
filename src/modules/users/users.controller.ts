import {
  Controller,
  Get,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { extensionImageReg } from '../../shared/constants';
import { UpdateProfileDto, GetAllGroupPermissionsQueryDTO } from './dto';
import { Permission } from '../../shared/enums';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Auth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser() user: AuthUser) {
    return this.userService.getProfile(user);
  }

  @Auth()
  @Post('upload-avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatarUser(
    @CurrentUser() user: AuthUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: extensionImageReg,
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatarUser(user, file);
  }

  @Auth()
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user, updateProfileDto);
  }

  @Auth(Permission.MANAGE_STAFF)
  @Get('staff')
  @HttpCode(HttpStatus.OK)
  getAllStaffMembers(
    @Query() getAllGroupPermissionsQueryDTO: GetAllGroupPermissionsQueryDTO,
  ) {
    return this.userService.getAllStaffMembers(getAllGroupPermissionsQueryDTO);
  }
}
