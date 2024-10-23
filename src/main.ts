import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const logLevel = configService.get<string>('LOG_LEVEL') || 'combined';
  app.use(morgan(logLevel));

  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
