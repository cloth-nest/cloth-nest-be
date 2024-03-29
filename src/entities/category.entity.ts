import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Tree,
  TreeParent,
  TreeChildren,
  OneToMany,
} from 'typeorm';
import { Product } from './';

@Entity({ name: 'category' })
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'level', nullable: false })
  level: number;

  @Column({ name: 'bg_url', nullable: true })
  bgImgUrl: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @TreeParent()
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
  })
  parent: Category;

  @TreeChildren()
  childs: Category[];

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
