import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group, Permission } from './';

@Entity({ name: 'group_permission' })
export class GroupPermission {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Group, (group) => group.groupPermission)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group;

  @ManyToOne(() => Permission, (permission) => permission.groupPermission)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission: Permission;

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
