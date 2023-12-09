import { IsNumberString } from 'class-validator';

export class DeletePermissionParamDto {
  @IsNumberString()
  id: string;
}
