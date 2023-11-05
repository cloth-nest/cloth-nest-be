import { registerAs } from '@nestjs/config';

import * as dotenv from 'dotenv';
dotenv.config();

const awsOptions = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3: {
    bucket: process.env.AWS_S3_BUCKET_NAME,
  },
};

export default registerAs('aws', () => awsOptions);
