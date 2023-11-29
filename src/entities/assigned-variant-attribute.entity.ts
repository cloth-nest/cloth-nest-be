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
import {
  AssignedVariantAttributeValues,
  ProductTypeProductVariant,
  ProductVariant,
} from './';

@Entity({ name: 'assigned_variant_attribute' })
export class AssignedVariantAttribute {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'variant_id', nullable: false })
  variantId: number;

  @Column({ name: 'product_type_product_variant_id', nullable: false })
  productTypeProductVariantId: number;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.assignedVariantAttributes,
  )
  @JoinColumn({ name: 'variant_id', referencedColumnName: 'id' })
  productVariant: ProductVariant;

  @ManyToOne(
    () => ProductTypeProductVariant,
    (productTypeProductVariant) =>
      productTypeProductVariant.assignedVariantAttributes,
  )
  @JoinColumn({
    name: 'product_type_product_variant_id',
    referencedColumnName: 'id',
  })
  productTypeProductVariant: ProductTypeProductVariant;

  @OneToMany(
    () => AssignedVariantAttributeValues,
    (assignedVariantAttributeValues) =>
      assignedVariantAttributeValues.assignedVariantAttribute,
  )
  assignedVariantAttributeValues: AssignedVariantAttributeValues[];

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
