import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Address, OrderDetail, User } from './';
import {
  OrderStatus,
  OrderPaymentMethod,
  OrderDeliveryMethod,
  OrderPaymentStatus,
} from '../shared/enums';
import { ColumnNumericTransformer } from '../shared/utils';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'address_id', nullable: true })
  addressId: number;

  @Column({
    name: 'status',
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.ON_PROCESS,
  })
  status: OrderStatus;

  @Column({
    name: 'total',
    nullable: false,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  total: number;

  @Column({ name: 'delivery_date', nullable: true })
  deliveryDate: Date;

  @Column({
    name: 'shipping_fee',
    nullable: true,
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  shippingFee: number;

  @Column({ name: 'apptransid', nullable: true })
  apptransid: string;

  @Column({ name: 'phone', nullable: true, length: 10 })
  phone: string;

  @Column({
    name: 'delivery_method',
    nullable: true,
    enum: OrderDeliveryMethod,
  })
  deliveryMethod: OrderDeliveryMethod;

  @Column({ name: 'payment_method', nullable: false, enum: OrderPaymentMethod })
  paymentMethod: OrderPaymentMethod;

  @Column({ name: 'payment_status', nullable: false, enum: OrderPaymentStatus })
  paymentStatus: OrderPaymentStatus;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Address, (address) => address.order)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

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
