import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Entity({ name: 'attribute_value' })
export class AttributeValue {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'value', nullable: false })
  value: string;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.attributeValues,
  )
  @JoinColumn({
    name: 'attribute_id',
    referencedColumnName: 'id',
  })
  attribute: ProductAttribute;

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
