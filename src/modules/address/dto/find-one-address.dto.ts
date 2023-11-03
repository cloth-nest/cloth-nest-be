import { IsNumberString } from 'class-validator';

export class FindOneAddressParams {
  @IsNumberString()
  id: string;
}
