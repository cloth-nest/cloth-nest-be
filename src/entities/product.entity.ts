import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  AssignedProductAttribute,
  Category,
  ProductImage,
  ProductType,
  ProductVariant,
  Review,
} from './';
import { ColumnNumericTransformer } from '../shared/utils';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({
    name: 'price',
    nullable: false,
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column({
    name: 'weight',
    nullable: false,
    type: 'double precision',
    default: 0,
  })
  weight: number;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @Column({ name: 'product_type_id', nullable: false })
  productTypeId: number;

  @OneToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({
    name: 'default_variant_id',
    referencedColumnName: 'id',
  })
  defaultVariant: ProductVariant;

  @OneToMany(
    () => AssignedProductAttribute,
    (assignedProductAttributes) => assignedProductAttributes.product,
  )
  assignedProductAttributes: AssignedProductAttribute[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: Category;

  @ManyToOne(() => ProductType, (productType) => productType.products)
  @JoinColumn({
    name: 'product_type_id',
    referencedColumnName: 'id',
  })
  productType: ProductType;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  review: Review[];

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
