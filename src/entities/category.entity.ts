import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'level', nullable: false })
  level: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.childCategories)
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
  })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

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
