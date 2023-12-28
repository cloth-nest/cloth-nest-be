import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  NotContains,
} from 'class-validator';
import { passwordReg } from '../../../shared/constants';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Matches(passwordReg)
  password: string;

  @IsOptional()
  @IsString()
  firebaseToken: string;
}
