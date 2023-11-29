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
  AssignedProductAttributeValues,
  Product,
  ProductTypeProductAttribute,
} from './';

@Entity({ name: 'assigned_product_attribute' })
export class AssignedProductAttribute {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'product_type_product_attrbute_id', nullable: false })
  productTypeProductAttributeId: number;

  @ManyToOne(() => Product, (product) => product.assignedProductAttributes)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(
    () => ProductTypeProductAttribute,
    (productTypeProductAttribute) =>
      productTypeProductAttribute.assignedProductAttributes,
  )
  @JoinColumn({
    name: 'product_type_product_attrbute_id',
    referencedColumnName: 'id',
  })
  productTypeProductAttribute: ProductTypeProductAttribute;

  @OneToMany(
    () => AssignedProductAttributeValues,
    (assignedProductAttributeValues) =>
      assignedProductAttributeValues.assignedProductAttribute,
  )
  assignedProductAttributeValues: AssignedProductAttributeValues[];

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
