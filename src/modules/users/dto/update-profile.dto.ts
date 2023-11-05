import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  IsOptional,
  Validate,
  IsEnum,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';
import { Gender } from '../../../shared/enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsEnum(Gender, {
    message: 'Gender must be one of the following values: MALE, FEMALE, OTHER',
  })
  gender: Gender;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone: string;

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
