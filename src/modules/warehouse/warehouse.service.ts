import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse, WarehouseStock } from '../../entities';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { CreateWarehouseBodyDTO, UpdateWarehouseBodyDTO } from './dto';

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

  public async updateWarehouse(
    warehouseId: string,
    updateWarehouseBodyDTO: UpdateWarehouseBodyDTO,
  ) {
    try {
      const { warehouseName } = updateWarehouseBodyDTO;

      const warehouse = await this.warehouseRepo.count({
        where: {
          id: parseInt(warehouseId),
        },
      });

      if (!warehouse) {
        throw new CustomErrorException(ERRORS.WarehouseNotFound);
      }

      // Check if warehouse name is exist
      const warehouseNameExist = await this.warehouseRepo.count({
        where: {
          name: warehouseName,
        },
      });

      if (warehouseNameExist) {
        throw new CustomErrorException(ERRORS.WarehouseNameExist);
      }

      await this.warehouseRepo.update(
        {
          id: parseInt(warehouseId),
        },
        {
          name: warehouseName,
        },
      );

      return {
        message: 'Update warehouse successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  public async deleteWarehouse(warehouseId: string) {
    try {
      const warehouse = await this.warehouseRepo.findOne({
        where: {
          id: parseInt(warehouseId),
        },
      });

      if (!warehouse) {
        throw new CustomErrorException(ERRORS.WarehouseNotFound);
      }

      // Dont't delete warehouse if it has stock (Not force delete)
      const warehouseStock = await this.warehouseStockRepo.count({
        where: {
          warehouseId: parseInt(warehouseId),
        },
      });

      if (warehouseStock) {
        throw new CustomErrorException(ERRORS.WarehouseHasStock);
      }

      await this.warehouseRepo.delete({
        id: parseInt(warehouseId),
      });

      return {
        message: 'Delete warehouse successfully',
      };
    } catch (err) {
      throw err;
    }
  }
}
