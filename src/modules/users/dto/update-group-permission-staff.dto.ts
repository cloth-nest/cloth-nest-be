import {
  IsOptional,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsNumberString,
  Validate,
  IsBoolean,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';

export class UpdateGroupPermissionStaffParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateGroupPermissionStaffBodyDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  groupPermissionIds: number[];

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
