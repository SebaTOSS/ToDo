import { Module } from '@nestjs/common';
import { LiveTestController } from './livetest.controller';

@Module({
  controllers: [LiveTestController],
})
export class LiveTestModule {}