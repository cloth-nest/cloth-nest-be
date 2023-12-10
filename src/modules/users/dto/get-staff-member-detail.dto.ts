import { IsNumberString } from 'class-validator';

export class GetStaffMemberDetailParamDTO {
  @IsNumberString()
  id: string;
}
