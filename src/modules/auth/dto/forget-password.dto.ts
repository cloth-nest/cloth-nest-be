import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
