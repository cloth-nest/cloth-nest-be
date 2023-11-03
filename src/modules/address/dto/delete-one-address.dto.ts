import { IsNumberString } from 'class-validator';

export class DeleteOneAddressParams {
  @IsNumberString()
  id: string;
}
