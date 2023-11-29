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
import { ProductAttribute } from './product-attribute.entity';
import {
  AssignedProductAttributeValues,
  AssignedVariantAttributeValues,
} from '.';

@Entity({ name: 'attribute_value' })
export class AttributeValue {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'value', nullable: false })
  value: string;

  @Column({ name: 'attribute_id', nullable: false })
  attributeId: number;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.attributeValues,
  )
  @JoinColumn({
    name: 'attribute_id',
    referencedColumnName: 'id',
  })
  attribute: ProductAttribute;

  @OneToMany(
    () => AssignedProductAttributeValues,
    (assignedProductAttributeValues) =>
      assignedProductAttributeValues.attributeValue,
  )
  assignedProductAttributeValues: AssignedProductAttributeValues[];

  @OneToMany(
    () => AssignedVariantAttributeValues,
    (assignedVariantAttributeValues) =>
      assignedVariantAttributeValues.attributeValue,
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
