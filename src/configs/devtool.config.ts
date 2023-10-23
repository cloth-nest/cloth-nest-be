import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const devtoolModuleOptions = {
  http: process.env.APP_ENV !== 'production' || false,
  port: parseInt(process.env.DEVTOOL_PORT) || 4000,
};

export default registerAs('devtool', () => devtoolModuleOptions);
