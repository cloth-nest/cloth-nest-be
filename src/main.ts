import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService).get<number>('port');

  await app.listen(port).then(() => {
    Logger.verbose(`App listening at ${port}. Happy coding!`, 'App');
  });
}
bootstrap();
