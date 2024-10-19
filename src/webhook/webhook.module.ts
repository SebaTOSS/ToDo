import { Module } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { SignatureService } from './signature.service';
import { WebhookService } from './webhook.service';
import { SignatureGuard } from './signature.guard';
import { ManagerFactory } from './managers/manager.factory';
import {
  EventDataType1Manager,
  EventDataType2Manager,
  EventDataType3Manager,
  EventType1Controller,
  EventType2Controller,
  EventType3Controller,
} from './managers';

@Module({
  imports: [ConfigModule],
  controllers: [WebhookController, EventType1Controller, EventType2Controller, EventType3Controller],
  providers: [
    WebhookService,
    ManagerFactory,
    SignatureService,
    SignatureGuard,
    EventDataType1Manager,
    EventDataType2Manager,
    EventDataType3Manager,
    {
      provide: 'EVENT_PUBLISHER',
      useFactory: (configService: ConfigService): ClientProxy => {
        return ClientProxyFactory.create({
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
      },
      inject: [ConfigService],
    },
  ],
})
export class WebhookModule { }