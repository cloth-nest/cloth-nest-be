import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { AttributeType } from '../../../../shared/enums';

export class RemoveAttributeBodyDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productTypeId: number;

  @IsNotEmpty()
  @IsEnum(AttributeType, {
    message:
      'AttributeType must be one of the following values: VARIANT_ATTRIBUTE, PRODUCT_ATTRIBUTE',
  })
  attributeType: AttributeType;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  productAttributeIds: number[];
}
