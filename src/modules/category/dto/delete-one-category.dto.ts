import { IsNumberString } from 'class-validator';

export class DeleteOneCategoryParamDto {
  @IsNumberString()
  id: string;
}
