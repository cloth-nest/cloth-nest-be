import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

const jwtModuleOptions: JwtModuleOptions = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'cloth-nest-app',
  signOptions: {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 60 * 1000,
  },
};

export default registerAs('jwt', () => jwtModuleOptions);
