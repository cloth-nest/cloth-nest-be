import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductType } from './';

@Entity({ name: 'product_type_product_attribute' })
export class ProductTypeProductAttribute {
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
    (productType) => productType.productTypeProductAttributes,
  )
  @JoinColumn({ name: 'product_type_id', referencedColumnName: 'id' })
  productType: ProductType;

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
