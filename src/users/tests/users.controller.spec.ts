import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto, UpdateUserDto, UserFiltersDto } from '../dto';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        reactivate: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const filters: UserFiltersDto = { name: 'John' };
            const pagination = { limit: 10, offset: 0 };
            const users = [{
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            }];

            jest.spyOn(service, 'findAll').mockResolvedValue(users);

            const result = await controller.findAll(filters, pagination);
            expect(result).toEqual(users);
            expect(service.findAll).toHaveBeenCalledWith(filters, pagination);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(user);

            const result = await controller.findOne(1);
            expect(result).toEqual(user);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(service, 'create').mockResolvedValue(user);

            const result = await controller.create(createUserDto);
            expect(result).toEqual(user);
            expect(service.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { name: 'John Doe Updated', email: 'john.updated@example.com' };
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(service, 'update').mockResolvedValue(user);

            const result = await controller.update(1, updateUserDto);
            expect(result).toEqual(user);
            expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(null);

            const result = await controller.remove(1);
            expect(result).toBeNull();
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
    
    describe('reactivate', () => {
        it('should reactivate a user', async () => {
            jest.spyOn(service, 'reactivate').mockResolvedValue(null);

            const result = await controller.reactivate(1);
            expect(result).toBeNull();
            expect(service.reactivate).toHaveBeenCalledWith(1);
        });
    });
});