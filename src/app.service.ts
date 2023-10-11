import { Get, HttpCode, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Get('/health-check')
  @HttpCode(200)
  healthCheck(): string {
    return 'Happy coding!';
  }
}
