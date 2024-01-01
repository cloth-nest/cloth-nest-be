import { IsNumberString } from 'class-validator';

export class GetReviewDetailParamDTO {
  @IsNumberString()
  id: string;
}
