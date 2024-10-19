import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { LiveTestModule } from './livetest/livetest.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    AppConfigModule,
    WebhookModule,
    LiveTestModule,
  ],
})
export class AppModule { }

