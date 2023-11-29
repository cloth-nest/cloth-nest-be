import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssignedProductAttribute, AttributeValue } from '.';

@Entity({ name: 'assigned_product_attribute_values' })
export class AssignedProductAttributeValues {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'assigned_product_attribute_id', nullable: false })
  assignedProductAttributeId: number;

  @Column({ name: 'attribute_value_id', nullable: false })
  attributeValueId: number;

  @ManyToOne(
    () => AssignedProductAttribute,
    (assignedProductAttribute) =>
      assignedProductAttribute.assignedProductAttributeValues,
  )
  @JoinColumn({
    name: 'assigned_product_attribute_id',
    referencedColumnName: 'id',
  })
  assignedProductAttribute: AssignedProductAttribute;

  @ManyToOne(
    () => AttributeValue,
    (attributeValue) => attributeValue.assignedProductAttributeValues,
  )
  @JoinColumn({
    name: 'attribute_value_id',
    referencedColumnName: 'id',
  })
  attributeValue: AttributeValue;

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
