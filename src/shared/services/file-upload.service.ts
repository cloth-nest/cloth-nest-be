import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  /**
   * Upload image to s3
   * @param buffer
   * @param s3Key
   * @returns url
   */
  public async uploadFileToS3(buffer: Buffer, s3Key: string): Promise<string> {
    const S3 = this.getS3();

    const commandPutObjectCommand = new PutObjectCommand({
      Bucket: this.configService.get<string>('aws.s3.bucket'),
      Body: buffer,
      Key: s3Key,
      ACL: 'public-read',
    });

    try {
      const response = await S3.send(commandPutObjectCommand);
      if (response.$metadata.httpStatusCode === 200) {
        return this.getPublicImageUrl(s3Key);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Remove image
   * @param s3Key
   */
  public async removeFileFromS3(s3Key: string) {
    const S3 = this.getS3();

    const commandDeleteObject = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('aws.s3.bucket'),
      Key: s3Key,
    });
    return S3.send(commandDeleteObject);
  }

  public getS3Url = () =>
    `https://${this.configService.get<string>(
      'aws.s3.bucket',
    )}.s3.${this.configService.get<string>('aws.region')}.amazonaws.com`;

  /**
   * Get public image url
   */
  public getPublicImageUrl(s3Key: string) {
    return `${this.getS3Url()}/${s3Key}`;
  }

  public async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer = [];
    return new Promise((resolve, reject) =>
      stream
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer)))
        .on('error', (error) => reject(error)),
    );
  }

  private getS3() {
    let s3ClientConfig: S3ClientConfig = {
      region: this.configService.get<string>('aws.region'),
    };

    if (this.configService.get<string>('app.appEnv').includes('local')) {
      s3ClientConfig = {
        credentials: {
          accessKeyId: this.configService.get<string>('aws.accessKeyId'),
          secretAccessKey: this.configService.get<string>(
            'aws.secretAccessKey',
          ),
        },
      };
    }
    return new S3Client(s3ClientConfig);
  }
}
