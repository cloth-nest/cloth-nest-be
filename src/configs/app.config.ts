import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const appOptions = {
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  appEnv: process.env.APP_ENV || 'local',
};

export default registerAs('app', () => appOptions);
