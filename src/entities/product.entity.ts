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
  AssignedProductAttribute,
  Category,
  ProductImage,
  ProductType,
  ProductVariant,
} from './';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'price', nullable: false, type: 'decimal' })
  price: number;

  @Column({ name: 'weight', nullable: false, type: 'decimal', default: 0 })
  weight: number;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

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
