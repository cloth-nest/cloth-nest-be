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
  AssignedVariantAttribute,
  Cart,
  OrderDetail,
  Product,
  UserWishlist,
  VariantImage,
  WarehouseStock,
} from './';
import { ColumnNumericTransformer } from '../shared/utils';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'sku',
    nullable: true,
    unique: true,
    type: 'varchar',
    length: 255,
  })
  sku: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'order', nullable: false, type: 'integer' })
  order: number;

  @Column({
    name: 'price_override',
    nullable: false,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column({
    name: 'weight_override',
    nullable: true,
    type: 'decimal',
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  weight: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @OneToMany(
    () => AssignedVariantAttribute,
    (assignedVariantAttributes) => assignedVariantAttributes.productVariant,
  )
  assignedVariantAttributes: AssignedVariantAttribute[];

  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Product;

  @OneToMany(() => VariantImage, (variantImage) => variantImage.productVariant)
  variantImages: VariantImage[];

  @OneToMany(
    () => WarehouseStock,
    (warehouseStock) => warehouseStock.productVariant,
  )
  warehouseStocks: WarehouseStock[];

  @OneToMany(() => UserWishlist, (userWishlist) => userWishlist.productVariant)
  userWishlist: UserWishlist[];

  @OneToMany(() => Cart, (cart) => cart.productVariant)
  cart: Cart[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail[];

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
