import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getBrokerConfig from './broker.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
      load: [getBrokerConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}