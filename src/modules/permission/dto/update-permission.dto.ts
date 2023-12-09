import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePermissionParamDto {
  @IsNumberString()
  id: string;
}

export class UpdatePermissionBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  permissionName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  permissionCode: string;
}
