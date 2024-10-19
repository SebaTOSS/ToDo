import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const logLevel = configService.get<string>('LOG_LEVEL') || 'combined';
  app.use(morgan(logLevel));

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
