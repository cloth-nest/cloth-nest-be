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
import { AssignedVariantAttribute, Product, VariantImage } from './';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'sku', nullable: true, unique: true })
  sku: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'price_override', nullable: false, type: 'decimal' })
  priceOverride: number;

  @Column({
    name: 'weight_override',
    nullable: true,
    type: 'decimal',
    default: 0,
  })
  weightOverride: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @OneToMany(
    () => AssignedVariantAttribute,
    (assignedVariantAttributes) => assignedVariantAttributes.productVariant,
  )
  assignedVariantAttributes: AssignedVariantAttribute[];

  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Product;

  @OneToMany(() => VariantImage, (variantImage) => variantImage.productVariant)
  variantImages: VariantImage[];

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
