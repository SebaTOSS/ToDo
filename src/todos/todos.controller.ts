import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  @Get()
  get() {
    return { message: 'Application is running correctly' };
  }
}