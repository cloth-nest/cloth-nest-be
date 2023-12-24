import { IsNumberString } from 'class-validator';

export class DeleteImageParamDTO {
  @IsNumberString()
  id: string;
}
