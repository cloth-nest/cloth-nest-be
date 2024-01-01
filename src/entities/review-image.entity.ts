import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './';

@Entity({ name: 'review_image' })
export class ReviewImage {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'image',
    nullable: false,
  })
  image: string;

  @Column({ name: 'order', nullable: false })
  order: number;

  @Column({ name: 'review_id', nullable: false })
  reviewId: number;

  @ManyToOne(() => Review, (review) => review.images)
  @JoinColumn({
    name: 'review_id',
    referencedColumnName: 'id',
  })
  review: Review;

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
