import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse, WarehouseStock } from '../../entities';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(WarehouseStock)
    private warehouseStockRepo: Repository<WarehouseStock>,
  ) {}

  public async getAllWarehouse() {
    try {
      const warehouses = await this.warehouseRepo.find({
        select: ['id', 'name'],
      });

      return {
        data: warehouses,
      };
    } catch (err) {
      throw err;
    }
  }
}
