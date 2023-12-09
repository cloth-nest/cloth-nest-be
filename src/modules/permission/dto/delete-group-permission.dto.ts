import { IsNumberString } from 'class-validator';

export class DeleteGroupPermissionParamDto {
  @IsNumberString()
  id: string;
}
