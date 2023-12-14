import {
  IsInt,
  IsArray,
  ArrayMinSize,
  IsNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

export class SyncWishlistItemsBodyDto {
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  variantIds: number[];
}
