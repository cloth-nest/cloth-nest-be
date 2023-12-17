import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsPositive,
  Length,
  IsBoolean,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  provinceCode: number;

  @IsNotEmpty()
  @IsString()
  provinceName: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  districtCode: number;

  @IsNotEmpty()
  @IsString()
  districtName: string;

  @IsNotEmpty()
  @IsString()
  wardCode: string;

  @IsNotEmpty()
  @IsString()
  wardName: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  phone: string;

  @IsNotEmpty()
  @IsBoolean()
  isAddressProfile: boolean;
}
