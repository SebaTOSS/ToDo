import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDo, ToDoState } from './entities';
import { ToDoDto, CreateToDoDto, UpdateToDoDto, ToDoFiltersDto } from './dto';
import { TransformToDto } from '../core';
import { LoggedUserDto } from '../auth/dto';

@Injectable()
export class ToDosService {
    constructor(
        @InjectRepository(ToDo)
        private readonly todoRepository: Repository<ToDo>,
        @InjectRepository(ToDoState)
        private readonly stateRepository: Repository<ToDoState>,
    ) { }

    @TransformToDto(ToDoDto)
    async findAll(user: LoggedUserDto, filters: ToDoFiltersDto, pagination: any): Promise<ToDo[]> {
        const { limit, offset } = pagination;

        const queryBuilder = this.todoRepository.createQueryBuilder('todo');
        this.addFilters(queryBuilder, user, filters);
        queryBuilder.skip(offset).take(limit);

        return queryBuilder.getMany();
    }

    @TransformToDto(ToDoDto)
    async findOne(user: LoggedUserDto, id: number): Promise<ToDo> {
        const toDo = await this.todoRepository.findOne({ where: { id, user } });
        if (!toDo) {
            throw new NotFoundException(`ToDO ${id} not found`);
        }

        return toDo;
    }

    @TransformToDto(ToDoDto)
    async create(user: LoggedUserDto, createToDoDto: CreateToDoDto): Promise<ToDo> {
        const state: ToDoState = await this.stateRepository.findOne({ where: { id: createToDoDto.state } });
        if (!state) {
            throw new NotFoundException(`State ${createToDoDto.state} not found`);
        }

        const toDo: ToDo = this.todoRepository.create({
            title: createToDoDto.title,
            description: createToDoDto.description,
            state,
            user,
        });

        return this.todoRepository.save(toDo);
    }

    @TransformToDto(ToDoDto)
    async update(user: LoggedUserDto, id: number, updateToDoDto: UpdateToDoDto): Promise<ToDo> {
        const state: ToDoState = await this.stateRepository.findOne({ where: { id: updateToDoDto.state } });
        const toDo: ToDo = await this.todoRepository.findOne({ where: { id, user } });
        if (!toDo) {
            throw new NotFoundException(`ToDO ${id} not found`);
        }

        if (!state) {
            throw new NotFoundException(`State ${updateToDoDto.state} not found`);
        }

        toDo.title = updateToDoDto.title;
        toDo.description = updateToDoDto.description;
        toDo.state = state;

        return this.todoRepository.save(toDo);
    }

    async remove(user: LoggedUserDto, id: number): Promise<void> {
        const todo: ToDo = await this.todoRepository.findOne({ where: { id, user } });
        if (!todo) {
            throw new NotFoundException(`Todo ${id} not found`);
        }
        todo.isActive = false;
        await this.todoRepository.save(todo);

        return null;
    }

    private addFilters(queryBuilder: any, user: LoggedUserDto, filters: ToDoFiltersDto): void {
        queryBuilder.andWhere('todo.userId = :userId', { userId: user.id });

        if (filters.title) {
            queryBuilder.andWhere('todo.title LIKE :title', { title: `%${filters.title}%` });
        }
        if (filters.description) {
            queryBuilder.andWhere('todo.description LIKE :description', { description: `%${filters.description}%` });
        }
        if (filters.isActive !== undefined) {
            queryBuilder.andWhere('todo.isActive = :isActive', { isActive: filters.isActive });
        }
    }
}