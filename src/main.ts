import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  });
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/documentation', app, document);

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
