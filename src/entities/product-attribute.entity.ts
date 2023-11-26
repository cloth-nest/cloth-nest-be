import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { ProductTypeProductAttribute } from './product-type-product-attribute.entity';

@Entity({ name: 'product_attribute' })
export class ProductAttribute {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute)
  attributeValues: AttributeValue[];

  @OneToMany(
    () => ProductTypeProductAttribute,
    (productTypeProductAttribute) =>
      productTypeProductAttribute.productAttribute,
  )
  productTypeProductAttribute: ProductTypeProductAttribute[];

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
