import { Body, Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ToDosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggedUser } from '../core';
import { CreateToDoDto, ToDoFiltersDto, UpdateToDoDto } from './dto';
import { LoggedUserDto } from '../auth/dto';

@ApiTags('TO-DOs')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly toDoService: ToDosService) { }

  @Get()
  @ApiOperation({ summary: 'Returns all to-dos for the logged user' })
  @ApiResponse({ status: 200, description: 'List of to-dos' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(
    @LoggedUser() user: LoggedUserDto,
    @Query() filters: ToDoFiltersDto, @Query() pagination: any,
    @Query('isActive', new DefaultValuePipe(true), ParseBoolPipe) isActive: boolean,
  ) {
    filters.isActive = isActive;
    return this.toDoService.findAll(user, filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ToDo by if belongs to the logged user' })
  @ApiResponse({ status: 200, description: 'ToDo retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'ToDo not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@LoggedUser() user: LoggedUserDto, @Param('id') id: number) {
    return this.toDoService.findOne(user, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new to do task to the logged user' })
  @ApiResponse({ status: 201, description: 'ToDo task created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@LoggedUser() user: LoggedUserDto, @Body() payload: CreateToDoDto) {
    return this.toDoService.create(user, payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ToDo task' })
  @ApiResponse({ status: 200, description: 'ToDo task updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'ToDo task not found.' })
  async update(@LoggedUser() user: LoggedUserDto, @Param('id') id: number, @Body() payload: UpdateToDoDto) {
    return this.toDoService.update(user, id, payload);
  }

}