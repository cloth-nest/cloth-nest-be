import { IsNotEmpty, IsString } from 'class-validator';

export class SignOutDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
