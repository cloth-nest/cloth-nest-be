import {
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotEmptyIfAllFieldsAreEmptyConstraint } from '../../../shared/dto';

export class UpdateOneCategoryParamDto {
  @IsNumberString()
  id: string;
}

export class UpdateOneCategoryBodyDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Validate(IsNotEmptyIfAllFieldsAreEmptyConstraint)
  requireNotEmpty: boolean;
}
