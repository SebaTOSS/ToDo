import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserFiltersDto } from './dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async findAll(@Query() filters: UserFiltersDto, @Query() pagination: any) {
        return this.userService.findAll(filters, pagination);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Post()
    async create(@Body() payload: CreateUserDto) {
        return this.userService.create(payload);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
        return this.userService.update(id, payload);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }

    @Post(':id/reactivate')
    async reactivate(@Param('id') id: number) {
        return this.userService.reactivate(id);
    }
}