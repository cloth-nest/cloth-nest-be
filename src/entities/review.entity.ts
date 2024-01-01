import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Product, ReviewImage, User } from './';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'content', nullable: false })
  content: string;

  @Column({ name: 'rating', nullable: false, type: 'numeric' })
  rating: number;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.review)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @OneToMany(() => ReviewImage, (reviewImage) => reviewImage.review)
  images: ReviewImage[];

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
