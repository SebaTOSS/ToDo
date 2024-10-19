import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('BROKER_URL')],
      queue: configService.get<string>('BROKER_QUEUE'),
      queueOptions: {
        durable: false,
      },
      socketOptions: {
        heartbeatIntervalInSeconds: configService.get<number>('HEARTBEAT_INTERVAL'),
              reconnectTimeInSeconds: configService.get<number>('RECONNECT_TIME'),
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
