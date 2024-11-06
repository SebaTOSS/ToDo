import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserFiltersDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggedUser } from '../core';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(@Query() filters: UserFiltersDto, @Query() pagination: any) {
        return this.userService.findAll(filters, pagination);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() payload: CreateUserDto) {
        return this.userService.create(payload);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
        return this.userService.update(id, payload);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }

    @Post(':id/reactivate')
    @ApiOperation({ summary: 'Reactivates a user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async reactivate(@Param('id') id: number) {
        return this.userService.reactivate(id);
    }
}