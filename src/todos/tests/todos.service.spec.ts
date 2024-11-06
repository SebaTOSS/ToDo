import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDosService } from '../todos.service';
import { ToDo, ToDoState } from '../entities';
import { CreateToDoDto, UpdateToDoDto, ToDoFiltersDto } from '../dto';
import { LoggedUserDto } from '../../auth/dto';

describe('ToDosService', () => {
    let service: ToDosService;
    let todoRepository: Repository<ToDo>;
    let stateRepository: Repository<ToDoState>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ToDosService,
                {
                    provide: getRepositoryToken(ToDo),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(ToDoState),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ToDosService>(ToDosService);
        todoRepository = module.get<Repository<ToDo>>(getRepositoryToken(ToDo));
        stateRepository = module.get<Repository<ToDoState>>(getRepositoryToken(ToDoState));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of todos', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const filters: ToDoFiltersDto = { title: 'Test' };
            const pagination = { limit: 10, offset: 0 };
            const todos: ToDo[] = [{
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: {} as ToDoState,
            }];

            jest.spyOn(todoRepository, 'createQueryBuilder').mockReturnValue({
                addFilters: jest.fn(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(todos),
            } as any);

            const result = await service.findAll(user, filters, pagination);
            expect(result).toEqual(todos);
            expect(todoRepository.createQueryBuilder).toHaveBeenCalled();
            expect(todoRepository.createQueryBuilder().andWhere).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a todo by id', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const todo: ToDo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: {} as ToDoState,
            };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(todo);

            const result = await service.findOne(user, 1);
            expect(result).toEqual(todo);
            expect(todoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user } });
        });

        it('should throw NotFoundException if todo is not found', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(user, 1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new todo', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const createToDoDto: CreateToDoDto = {
                title: 'Test ToDo',
                description: 'Test Description',
                state: 1,
            };
            const state: ToDoState = { id: 1, name: 'Test State', description: 'Test Description' };
            const todo: ToDo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: state,
            };

            jest.spyOn(stateRepository, 'findOne').mockResolvedValue(state);
            jest.spyOn(todoRepository, 'create').mockReturnValue(todo);
            jest.spyOn(todoRepository, 'save').mockResolvedValue(todo);

            const result = await service.create(user, createToDoDto);
            expect(result).toEqual(todo);
            expect(stateRepository.findOne).toHaveBeenCalledWith({ where: { id: createToDoDto.state } });
            expect(todoRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if state is not found', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const createToDoDto: CreateToDoDto = {
                state: 1,
                title: 'Test ToDo',
                description: 'Test Description',
            };

            jest.spyOn(stateRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(user, createToDoDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a todo', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const updateToDoDto: UpdateToDoDto = {
                title: 'Updated ToDo',
                description: 'Updated Description',
                state: 1,
            };
            const state: ToDoState = { id: 1, name: 'Test State', description: 'Test Description' };
            const todo: ToDo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: state,
            };
            const updatedToDo: ToDo = {
                id: 1,
                title: 'Updated ToDo',
                description: 'Updated Description',
                state: state,
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
            };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(todo);
            jest.spyOn(stateRepository, 'findOne').mockResolvedValue(state);
            jest.spyOn(todoRepository, 'save').mockResolvedValue(updatedToDo);

            const result = await service.update(user, 1, updateToDoDto);
            expect(result).toEqual(expect.objectContaining({
                ...updatedToDo,
                state,
            }));
            expect(todoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user } });
            expect(stateRepository.findOne).toHaveBeenCalledWith({ where: { id: updateToDoDto.state } });
            expect(todoRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if todo is not found', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const updateToDoDto: UpdateToDoDto = {
                title: 'Updated ToDo',
                description: 'Updated Description',
                state: 1,
            };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(stateRepository, 'findOne').mockResolvedValue({ id: 1, name: 'Test State', description: 'Test Description' });

            await expect(service.update(user, 1, updateToDoDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if state is not found', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const updateToDoDto: UpdateToDoDto = {
                title: 'Updated ToDo',
                description: 'Updated Description',
                state: 1,
            };
            const todo: ToDo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: {} as ToDoState,
            };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(todo);
            jest.spyOn(stateRepository, 'findOne').mockResolvedValue(null);

            await expect(service.update(user, 1, updateToDoDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a todo', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };
            const todo: ToDo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                isActive: true,
                createdAt: new Date(),
                lastUpdate: new Date(),
                user: user as any,
                state: {} as ToDoState,
            };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(todo);
            jest.spyOn(todoRepository, 'save').mockResolvedValue(todo);

            const result = await service.remove(user, 1);
            expect(result).toBeNull();
            expect(todoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user } });
            expect(todoRepository.save).toHaveBeenCalledWith({ ...todo, isActive: false });
        });

        it('should throw NotFoundException if todo is not found', async () => {
            const user: LoggedUserDto = { id: 1, email: 'test@example.com' };

            jest.spyOn(todoRepository, 'findOne').mockResolvedValue(null);

            await expect(service.remove(user, 1)).rejects.toThrow(NotFoundException);
        });
    });
});