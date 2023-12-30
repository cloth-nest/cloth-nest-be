import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse, WarehouseStock } from '../../entities';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { CreateWarehouseBodyDTO } from './dto';

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

  public async createWarehouse(createWarehouseBodyDTO: CreateWarehouseBodyDTO) {
    try {
      console.log(createWarehouseBodyDTO);
      const { warehouseName } = createWarehouseBodyDTO;

      // Check if warehouse name is exist
      const warehouse = await this.warehouseRepo.count({
        where: {
          name: warehouseName,
        },
      });

      if (warehouse) {
        throw new CustomErrorException(ERRORS.WarehouseNameExist);
      }

      const createdWarehouse = await this.warehouseRepo.save(
        this.warehouseRepo.create({
          name: warehouseName,
        }),
      );

      return {
        message: 'Create warehouse successfully',
        data: {
          id: createdWarehouse.id,
          name: createdWarehouse.name,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
