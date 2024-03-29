import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  UserPermission,
  UserAddress,
  Address,
  UserGroup,
  UserWishlist,
  Cart,
  Order,
  Review,
} from './';
import * as bcrypt from 'bcrypt';
import { Gender } from '../shared/enums';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', unique: true, length: 255, nullable: false })
  email: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'is_super_user', default: false, nullable: false })
  isSuperUser: boolean;

  @Column({ name: 'is_staff', default: false, nullable: false })
  isStaff: boolean;

  @Column({ name: 'is_active', default: false, nullable: true })
  isActive: boolean;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'date_joined', nullable: false })
  dateJoined: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'default_billing_address_id', nullable: true })
  defaultBillingAddressId: number;

  @Column({ name: 'firebase_token', nullable: true })
  firebaseToken: string;

  @OneToOne(() => Address, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'default_shipping_address_id',
    referencedColumnName: 'id',
  })
  defaultShippingAddress: Address;

  @OneToOne(() => Address)
  @JoinColumn({
    name: 'profile_shipping_address_id',
    referencedColumnName: 'id',
  })
  profileShippingAddress: Address;

  @Column({ name: 'name', default: '', nullable: true })
  note: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'gender', nullable: true, default: Gender.OTHER })
  gender: Gender;

  @Column({ name: 'phone', nullable: true, length: 10 })
  phone: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermission: UserPermission[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroup: UserGroup[];

  @OneToMany(() => UserWishlist, (userWishlist) => userWishlist.user)
  userWishlist: UserWishlist[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  userAddress: UserAddress[];

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => Review, (review) => review.user)
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

  // Hooks
  @BeforeInsert()
  async hashPassword() {
    // Get password
    const password = this.password;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Assign new password is hashed
    this.password = hashPassword;
  }
}
