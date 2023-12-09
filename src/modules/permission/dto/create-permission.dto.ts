import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOnePermissionBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  permissionName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  permissionCode: string;
}
