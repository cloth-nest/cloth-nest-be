import { IsNumberString } from 'class-validator';

export class GetGroupPermissionParamDto {
  @IsNumberString()
  id: string;
}
