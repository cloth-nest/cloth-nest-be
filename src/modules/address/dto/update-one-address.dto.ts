import {
  IsEmail,
  IsInt,
  IsNumberString,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';

export class UpdateOneAddressParams {
  @IsNumberString()
  id: string;
}

export class UpdateOneAddressDto {
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
  @IsInt()
  @IsPositive()
  provinceCode: number;

  @IsOptional()
  @IsString()
  provinceName: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  districtCode: number;

  @IsOptional()
  @IsString()
  districtName: string;

  @IsOptional()
  @IsString()
  wardCode: string;

  @IsOptional()
  @IsString()
  wardName: string;

  @IsOptional()
  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone: string;

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
