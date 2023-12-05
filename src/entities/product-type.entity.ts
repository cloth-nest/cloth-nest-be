import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  Product,
  ProductTypeProductAttribute,
  ProductTypeProductVariant,
} from './';

@Entity({ name: 'product_type' })
export class ProductType {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'has_variants', nullable: true, type: 'boolean' })
  hasVariants: boolean;

  @Column({ name: 'is_shipping_required', nullable: true, type: 'boolean' })
  isShippingRequired: boolean;

  @Column({
    name: 'weight',
    nullable: true,
    type: 'double precision',
    default: 0,
  })
  weight: number;

  @Column({ name: 'size_chart', nullable: true, type: 'text' })
  sizeChartImage: string;

  @OneToMany(() => Product, (product) => product.productType)
  products: Product[];

  @OneToMany(
    () => ProductTypeProductAttribute,
    (productTypeProductAttribute) => productTypeProductAttribute.productType,
  )
  productTypeProductAttributes: ProductTypeProductAttribute[];

  @OneToMany(
    () => ProductTypeProductVariant,
    (productTypeProductVariant) => productTypeProductVariant.productType,
  )
  productTypeProductVariants: ProductTypeProductVariant[];

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
