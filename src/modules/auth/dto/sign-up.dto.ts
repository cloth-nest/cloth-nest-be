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

export class SignUpDto {
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

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  firebaseToken: string;
}
