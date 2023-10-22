import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class VerifyForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1000)
  @Max(9999)
  code: number;
}
