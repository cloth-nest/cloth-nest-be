import 'reflect-metadata';
import {
  createPostgresDatabase,
  DatabaseCreateContext,
} from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();
const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPE_PASSWORD,
  TYPEORM_PORT,
  TYPEORM_DATABASE,
} = process.env;

(async () => {
  const options: DatabaseCreateContext = {
    options: {
      type: 'postgres',
      host: TYPEORM_HOST || 'localhost',
      port: Number(TYPEORM_PORT) || 5432,
      username: TYPEORM_USERNAME || 'postgres',
      password: TYPE_PASSWORD || 'Tuan2002',
      database: TYPEORM_DATABASE || 'cloth-nest',
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    },
    ifNotExist: true,
    synchronize: true,
  };

  await createPostgresDatabase(options);
})();
