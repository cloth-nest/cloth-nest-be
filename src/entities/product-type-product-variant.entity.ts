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
import { AssignedVariantAttribute, ProductAttribute, ProductType } from './';

@Entity({ name: 'product_type_product_variant' })
export class ProductTypeProductVariant {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'product_type_id' })
  productTypeId: number;

  @Column({ name: 'product_attribute_id' })
  productAttributeId: number;

  @Column({ name: 'order', nullable: false })
  order: number;

  @ManyToOne(
    () => ProductType,
    (productType) => productType.productTypeProductVariants,
  )
  @JoinColumn({ name: 'product_type_id', referencedColumnName: 'id' })
  productType: ProductType;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.productTypeProductVariant,
  )
  @JoinColumn({ name: 'product_attribute_id', referencedColumnName: 'id' })
  productAttribute: ProductAttribute;

  @OneToMany(
    () => AssignedVariantAttribute,
    (assignedVariantAttributes) =>
      assignedVariantAttributes.productTypeProductVariant,
  )
  assignedVariantAttributes: AssignedVariantAttribute[];

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
