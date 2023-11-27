import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { ProductVariant, ProductImage } from './';

@Entity({ name: 'variant_image' })
export class VariantImage {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'product_variant_id' })
  productVariantId: number;

  @Column({ name: 'product_image_id' })
  productImageId: number;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.variantImages,
  )
  @JoinColumn({ name: 'product_variant_id', referencedColumnName: 'id' })
  productVariant: ProductVariant;

  @ManyToOne(() => ProductImage, (productImage) => productImage.variantImages)
  @JoinColumn({ name: 'product_image_id', referencedColumnName: 'id' })
  productImage: ProductImage;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
