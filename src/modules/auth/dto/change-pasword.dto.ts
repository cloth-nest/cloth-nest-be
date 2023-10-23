import { IsNotEmpty, IsString, Matches, NotContains } from 'class-validator';
import { passwordReg } from '../../../shared/constants';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Matches(passwordReg)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  @Matches(passwordReg)
  newPassword: string;
}
