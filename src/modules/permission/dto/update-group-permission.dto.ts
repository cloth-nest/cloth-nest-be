import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsNumberString,
  Validate,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';

export class UpdateGroupPermissionParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateGroupPermissionBodyDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  groupPermissionName: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  permissionIds: number[];

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
