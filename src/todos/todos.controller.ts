import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('TO-DOs')
@Controller('todos')
export class TodosController {
  @Get()
  @ApiOperation({ summary: 'Returns all to-dos for the logged user' })
  @ApiResponse({ status: 200, description: 'List of to-dos' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  get() {
    return { message: 'Application is running correctly' };
  }
}