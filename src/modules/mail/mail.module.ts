import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get<MailerOptions>('mailer'),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
