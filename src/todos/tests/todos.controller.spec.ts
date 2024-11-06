import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '../todos.controller';
import { ToDosService } from '../todos.service';
import { CreateToDoDto, ToDoFiltersDto, UpdateToDoDto } from '../dto';
import { User } from '../../users/entities';

describe('TodosController', () => {
    let controller: TodosController;
    let service: ToDosService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [
                {
                    provide: ToDosService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TodosController>(TodosController);
        service = module.get<ToDosService>(ToDosService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of todos', async () => {
            const user: User = {
                id: 1,
                password: 'password',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                lastLogin: new Date(),
                firstLogin: new Date(),
                isActive: true,
            };
            const state = { id: 1, name: 'Test State', description: 'Test Description' };
            const filters: ToDoFiltersDto = { title: 'Test' };
            const pagination = { limit: 10, offset: 0 };
            const todos = [{
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                createdAt: new Date(),
                lastUpdate: new Date(),
                isActive: true,
                state,
                user,
            }];

            jest.spyOn(service, 'findAll').mockResolvedValue(todos);

            const result = await controller.findAll(user, filters, pagination, true);
            expect(result).toEqual(todos);
            expect(service.findAll).toHaveBeenCalledWith(user, filters, pagination);
        });
    });

    describe('findOne', () => {
        it('should return a todo by id', async () => {
            const user: User = {
                id: 1,
                password: 'password',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                lastLogin: new Date(),
                firstLogin: new Date(),
                isActive: true,
            };
            const state = { id: 1, name: 'Test State', description: 'Test Description' };
            const todo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                createdAt: new Date(),
                lastUpdate: new Date(),
                isActive: true,
                state,
                user,
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(todo);

            const result = await controller.findOne(user, 1);
            expect(result).toEqual(todo);
            expect(service.findOne).toHaveBeenCalledWith(user, 1);
        });
    });

    describe('create', () => {
        it('should create a new todo', async () => {
            const user: User = {
                id: 1,
                password: 'password',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                lastLogin: new Date(),
                firstLogin: new Date(),
                isActive: true,
            };
            const state = { id: 1, name: 'Test State', description: 'Test Description' };
            const todo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                createdAt: new Date(),
                lastUpdate: new Date(),
                isActive: true,
                state,
                user,
            };
            const createToDoDto: CreateToDoDto = { title: 'Test ToDo', description: 'Test Description', state: 1 };

            jest.spyOn(service, 'create').mockResolvedValue(todo);

            const result = await controller.create(user, createToDoDto);
            expect(result).toEqual(todo);
            expect(service.create).toHaveBeenCalledWith(user, createToDoDto);
        });
    });

    describe('update', () => {
        it('should update a todo', async () => {
            const user: User = {
                id: 1,
                password: 'password',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date(),
                lastLogin: new Date(),
                firstLogin: new Date(),
                isActive: true,
            };
            const state = { id: 1, name: 'Test State', description: 'Test Description' };
            const todo = {
                id: 1,
                title: 'Test ToDo',
                description: 'Test Description',
                createdAt: new Date(),
                lastUpdate: new Date(),
                isActive: true,
                state,
                user,
            };
            const updateToDoDto: UpdateToDoDto = { title: 'Updated ToDo', description: 'Updated Description', state: 1 };

            jest.spyOn(service, 'update').mockResolvedValue(todo);

            const result = await controller.update(user, 1, updateToDoDto);
            expect(result).toEqual(todo);
            expect(service.update).toHaveBeenCalledWith(user, 1, updateToDoDto);
        });
    });
});