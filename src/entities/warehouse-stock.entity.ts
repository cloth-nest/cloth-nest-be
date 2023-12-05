import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Warehouse, ProductVariant } from './';

@Entity({ name: 'warehouse_stock' })
export class WarehouseStock {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'variant_id' })
  variantId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.warehouseStocks,
  )
  @JoinColumn({ name: 'variant_id', referencedColumnName: 'id' })
  productVariant: ProductVariant;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseStocks)
  @JoinColumn({ name: 'warehouse_id', referencedColumnName: 'id' })
  warehouse: Warehouse;

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
