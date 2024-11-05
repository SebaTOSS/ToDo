import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities';
import { UserFiltersDto, CreateUserDto, UpdateUserDto } from '../dto';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const filters: UserFiltersDto = { name: 'John' };
            const pagination = { limit: 10, offset: 0 };
            const users: User[] = [{
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            }];

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                addFilters: jest.fn(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(users),
            } as any);

            const result = await service.findAll(filters, pagination);
            expect(result).toEqual(users);
            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(repository.createQueryBuilder().andWhere).toHaveBeenCalled();
        });

        it('should return an empty array if no users are found', async () => {
            const filters: UserFiltersDto = { name: 'John' };
            const pagination = { limit: 10, offset: 0 };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                addFilters: jest.fn(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
            } as any);

            const result = await service.findAll(filters, pagination);
            expect(result).toEqual([]);
            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(repository.createQueryBuilder().andWhere).toHaveBeenCalled();
        });

        it('should add all filters and get some users', async () => {
            const filters: UserFiltersDto = {
                name: 'John',
                email: 'john@example.com',
                isActive: true,
                firstLogin: new Date(),
                lastLogin: new Date(),
                createdAt: new Date(),
            };
            const pagination = { limit: 10, offset: 0 };
            const users: User[] = [{
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            }];
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                addFilters: jest.fn(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(users),
            } as any);

            const result = await service.findAll(filters, pagination);
            expect(result).toEqual(users);
            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(6);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            const result = await service.findOne(1);
            expect(result).toEqual(user);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOneByEmail', () => {
        it('should return a user by email', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            const result = await service.findOneByEmail('john@example.com');
            expect(result).toEqual(user);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
        });

        it('should return null if user is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.findOneByEmail('john@example.com');
            expect(result).toEqual(null);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
        });
    });

    describe('findByEmailAndPassword', () => {
        it('should return a user by email and password', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: '$2b$10$QIn4wdHgMStkWWeDmCX1GeL42Tg3wjNLTJNBjSQQMi/hX4HjL7HKu',
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            const result = await service.findOneByEmailAndPassword('john@example.com', 'password');
            expect(result).toBeDefined();
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com', isActive: true } });
        });

        it('should return that password not match', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'unmatched-password',
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            const result = await service.findOneByEmailAndPassword('john@example.com', 'password');
            expect(result).toBeNull();
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com', isActive: true } });
        });

        it('should return that user is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.findOneByEmailAndPassword('john@example.com', 'password');
            expect(result).toBeNull();
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com', isActive: true } });
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
            };
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(user);
            jest.spyOn(repository, 'save').mockResolvedValue(user);

            const result = await service.create(createUserDto);
            expect(result).toEqual(expect.objectContaining({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                isActive: true,
            }));
            expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
            expect(repository.create).toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalled();
        });

        it('should fail on create a new user beacuse email already exists', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@email.com',
                password: 'password',
            };
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@email.com',
                password: 'password',
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };
            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            await expect(service.create(createUserDto)).rejects.toThrow('User with same email already exists');
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {
                name: 'John Doe Updated',
                email: 'john.updated@example.com',
            };
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: undefined,
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'preload').mockResolvedValue(user);
            jest.spyOn(repository, 'save').mockResolvedValue({ ...user, ...updateUserDto });

            const result = await service.update(1, updateUserDto);
            expect(result).toEqual({ ...user, ...updateUserDto });
            expect(repository.preload).toHaveBeenCalledWith({ id: 1, ...updateUserDto });
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(repository, 'preload').mockResolvedValue(null);

            await expect(service.update(1, {} as UpdateUserDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);
            jest.spyOn(repository, 'save').mockResolvedValue(user);

            const result = await service.remove(1);
            expect(result).toEqual(null);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if user is not removed', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'test@test.com',
                password: 'password',
                isActive: true,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);
            jest.spyOn(repository, 'save').mockRejectedValue(new Error());

            await expect(service.remove(1)).rejects.toThrow(Error);
        });
    });

    describe('reactivate', () => {
        it('should reactivate a user', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
                isActive: false,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);
            jest.spyOn(repository, 'save').mockResolvedValue({ ...user, isActive: true });

            const result = await service.reactivate(1);
            expect(result).toEqual(null);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.reactivate(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException on save', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
                isActive: false,
                createdAt: new Date(),
                firstLogin: new Date(),
                lastLogin: new Date(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);
            jest.spyOn(repository, 'save').mockRejectedValue(new Error(`User 1 not reactivated`));

            await expect(service.reactivate(1)).rejects.toThrow(Error);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.save).toHaveBeenCalled();
        });
    });
});