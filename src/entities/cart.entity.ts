import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { ProductVariant, User } from './';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'product_variant_id' })
  productVariantId: number;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.cart)
  @JoinColumn({ name: 'product_variant_id', referencedColumnName: 'id' })
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
