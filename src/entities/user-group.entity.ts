import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User, Group } from './';

@Entity({ name: 'user_group' })
export class UserGroup {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => User, (user) => user.userGroup)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroup)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group;

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
