import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateGroupPermissionBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  groupPermissionName: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  permissionIds: number[];
}
