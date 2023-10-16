import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResendCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
