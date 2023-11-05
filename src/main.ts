import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const port = app.get(ConfigService).get<number>('app.port');

  await app.listen(port).then(() => {
    Logger.verbose(`App listening at ${port}. Happy coding!`, 'App');
  });
}
bootstrap();
