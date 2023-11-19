import { IsNumberString } from 'class-validator';

export class FindOneCategoryParamDto {
  @IsNumberString()
  id: string;
}
