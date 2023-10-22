import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';

import * as dotenv from 'dotenv';
dotenv.config();

const cacheModuleOptions: CacheModuleOptions = {
  ttl: parseInt(process.env.CACHE_TTL_DEFAULT, 10) * 1000 || 180000,
};

export default registerAs('cache', () => cacheModuleOptions);
