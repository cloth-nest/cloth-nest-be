import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  AttributeValue,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
} from './';

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

  @OneToMany(
    () => ProductTypeProductVariant,
    (productTypeProductVariant) => productTypeProductVariant.productAttribute,
  )
  productTypeProductVariant: ProductTypeProductVariant[];

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
