import { Controller, Get } from '@nestjs/common';

@Controller('livetest')
export class LiveTestController {
  @Get()
  checkLiveTest() {
    return { message: 'Application is running correctly' };
  }
}