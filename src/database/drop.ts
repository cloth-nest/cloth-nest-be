import 'reflect-metadata';
import { DatabaseDropContext, dropDatabase } from 'typeorm-extension';
import * as dotenv from 'dotenv';
dotenv.config();
const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPE_PASSWORD,
  TYPEORM_PORT,
  TYPEORM_DATABASE,
} = process.env;

(async () => {
  const options: DatabaseDropContext = {
    options: {
      type: 'postgres',
      host: TYPEORM_HOST || 'localhost',
      port: Number(TYPEORM_PORT) || 5432,
      username: TYPEORM_USERNAME || 'postgres',
      password: TYPE_PASSWORD || 'Tuan2002',
      database: TYPEORM_DATABASE || 'cloth-nest',
    },
    ifExist: true,
  };

  // Drop the database with specification of the DataSource options
  await dropDatabase(options);
})();
