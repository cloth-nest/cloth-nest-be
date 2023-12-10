import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities';
import { UserController } from './users.controller';
import { FileUploadService } from '../../shared/services';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, FileUploadService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
