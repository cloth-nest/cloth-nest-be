import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { PermissionFactory } from './factories/permission.factory';
import { join } from 'path';
import {
  UserSeeder,
  PermissionSeeder,
  UserPermissionSeeder,
  GroupSeeder,
  GroupPermissonSeeder,
  CategorySeeder,
  ProductSeeder,
  ProductAttributeSeeder,
  AttributeValueSeeder,
  ProductTypeSeeder,
  ProductTypeProductAttributeSeeder,
  ProductTypeProductVariantSeeder,
  ProductVariantSeeder,
  ProductImageSeeder,
  AssignedProductAttributeSeeder,
  AssignedVariantAttributeSeeder,
  AssignedProductAttributeValuesSeeder,
  AssignedVariantAttributeValuesSeeder,
  VariantImageSeeder,
  UserGroupSeeder,
  WarehouseSeeder,
  WarehouseStockSeeder,
  UserWishlistSeeder,
  CartSeeder,
} from './seeders';

dotenv.config();
const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPE_PASSWORD,
  TYPEORM_PORT,
  TYPEORM_DATABASE,
} = process.env;

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: TYPEORM_HOST || 'localhost',
    port: Number(TYPEORM_PORT) || 5432,
    username: TYPEORM_USERNAME || 'postgres',
    password: TYPE_PASSWORD || 'Tuan2002',
    database: TYPEORM_DATABASE || 'cloth-nest',
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    // additional config options brought by typeorm-extension
    factories: [PermissionFactory],
    seeds: [
      UserSeeder,
      PermissionSeeder,
      UserPermissionSeeder,
      GroupSeeder,
      GroupPermissonSeeder,
      UserGroupSeeder,
      CategorySeeder,
      ProductTypeSeeder,
      ProductSeeder,
      ProductAttributeSeeder,
      AttributeValueSeeder,
      ProductTypeProductAttributeSeeder,
      ProductTypeProductVariantSeeder,
      ProductVariantSeeder,
      ProductImageSeeder,
      VariantImageSeeder,
      AssignedProductAttributeSeeder,
      AssignedVariantAttributeSeeder,
      AssignedProductAttributeValuesSeeder,
      AssignedVariantAttributeValuesSeeder,
      WarehouseSeeder,
      WarehouseStockSeeder,
      UserWishlistSeeder,
      CartSeeder,
    ],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await dataSource.synchronize(true);

  try {
    console.log('\x1b[96m---------- Starting seeder ---------- \x1b[0m');
    await runSeeders(dataSource);
  } catch (err) {
    console.log(err);
    console.log('\x1b[91mHave error when seeding\x1b[0m');
  }
  console.log('\x1b[95m---------- Finished seeder ----------\x1b[0m');
})();
