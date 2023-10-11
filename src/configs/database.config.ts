import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPE_PASSWORD || 'Tuan2002',
  port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
  database: process.env.TYPEORM_DATABASE || 'cloth-nest',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE) || false,
  autoLoadEntities: true,
};

export default registerAs('database', () => typeOrmModuleOptions);
