import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order, ProductVariant } from './';
import { ColumnNumericTransformer } from '../shared/utils';

@Entity({ name: 'order_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'order_id', nullable: false })
  orderId: number;

  @Column({ name: 'variant_id', nullable: false })
  variantId: number;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @Column({
    name: 'price',
    nullable: false,
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: Order;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderDetail,
  )
  @JoinColumn({
    name: 'variant_id',
    referencedColumnName: 'id',
  })
  productVariant: ProductVariant;

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
