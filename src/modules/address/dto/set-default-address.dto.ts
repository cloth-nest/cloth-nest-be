import { IsNumberString } from 'class-validator';

export class SetDefaultAddressParams {
  @IsNumberString()
  id: string;
}
