import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssignedVariantAttribute, AttributeValue } from '.';

@Entity({ name: 'assigned_variant_attribute_values' })
export class AssignedVariantAttributeValues {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'assigned_variant_attribute_id', nullable: false })
  assignedVariantAttributeId: number;

  @Column({ name: 'attribute_value_id', nullable: false })
  attributeValueId: number;

  @Column({ name: 'order', nullable: false, type: 'integer' })
  order: number;

  @ManyToOne(
    () => AssignedVariantAttribute,
    (assignedVariantAttribute) =>
      assignedVariantAttribute.assignedVariantAttributeValues,
  )
  @JoinColumn({
    name: 'assigned_variant_attribute_id',
    referencedColumnName: 'id',
  })
  assignedVariantAttribute: AssignedVariantAttribute;

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
