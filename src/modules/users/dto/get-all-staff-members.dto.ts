import { IsNotEmpty, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountActiveStatus } from '../../../shared/enums';

export class GetAllGroupPermissionsQueryDTO {
  @IsOptional()
  @IsEnum(AccountActiveStatus, {
    message:
      'AccountActiveStatus must be one of the following values: ACTIVE, INACTIVE',
  })
  accountActive: AccountActiveStatus;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limit: number;
}
