import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  public async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      password;
      return result;
    }
    return null;
  }

  public async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async signUp(signUpDto: SignUpDto) {
    try {
      // Check email existed
      const user = await this.usersService.findUserByEmail(signUpDto.email);
      if (user) {
        throw new CustomErrorException(ERRORS.EmailExisted);
      }

      // Create new user
      const createdUser = await this.usersService.createNewUser(signUpDto);

      // Send to user gmail
      await this.sendCodeToUserEmail(createdUser.email);

      return {
        message: 'Please, verify email!',
        data: createdUser,
      };
    } catch (error) {
      throw error;
    }
  }

  private genCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  private async sendCodeToUserEmail(email: string) {
    // Gen code with 4 number
    const code = this.genCode();

    // Set cache to countdown
    await this.cacheManager.set(email, code);

    // Send to gmail of user
    await this.mailService.sendUserConfirmation(email, code);
  }
}
