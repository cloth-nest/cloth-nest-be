import { Controller, Req, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './shared/guards';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      data: req.user,
    };
  }

  @Get('/health-check')
  @HttpCode(200)
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
