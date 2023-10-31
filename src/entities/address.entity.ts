import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddress } from './';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'province_code', nullable: false })
  provinceCode: number;

  @Column({ name: 'province_name', nullable: false })
  provinceName: string;

  @Column({ name: 'district_code', nullable: false })
  districtCode: number;

  @Column({ name: 'district_name', nullable: false })
  districtName: string;

  @Column({ name: 'ward_code', nullable: false })
  wardCode: number;

  @Column({ name: 'ward_name', nullable: false })
  wardName: string;

  @Column({ name: 'detail', nullable: false })
  detail: string;

  @Column({ name: 'phone', nullable: false, length: 10 })
  phone: string;

  @OneToMany(() => UserAddress, (userAddress) => userAddress.address)
  userAddress: UserAddress[];

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
