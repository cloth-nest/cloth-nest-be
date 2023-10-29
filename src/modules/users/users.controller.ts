import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from '../../shared/interfaces';
import { Auth, CurrentUser } from '../../shared/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Auth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser() user: AuthUser) {
    return this.userService.getProfile(user);
  }
}
