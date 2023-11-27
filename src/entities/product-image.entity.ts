import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product, VariantImage } from './';

@Entity({ name: 'product_image' })
export class ProductImage {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'image', nullable: false })
  image: string;

  @Column({ name: 'order', nullable: false })
  order: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @OneToMany(() => VariantImage, (variantImage) => variantImage.productVariant)
  variantImages: VariantImage[];

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Product;

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
