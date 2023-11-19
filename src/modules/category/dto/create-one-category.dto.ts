import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOneCategoryBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  parentId: number;
}
