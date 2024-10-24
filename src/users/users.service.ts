import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransformToDto } from '../core';
import { UserDto, CreateUserDto, UpdateUserDto, UserFiltersDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    @TransformToDto(UserDto)
    async findAll(filters: UserFiltersDto, pagination: any): Promise<User[]> {
        const { limit, offset } = pagination;
        
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        this.addFilters(queryBuilder, filters);
        queryBuilder.skip(offset).take(limit);

        return queryBuilder.getMany();
    }

    @TransformToDto(UserDto)
    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return user;
    }

    @TransformToDto(UserDto)
    async findOneByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            return user;
        }

        return null;
    }

    @TransformToDto(UserDto)
    async findOneByEmailAndPassword(email: string, password: string): Promise<User> {
        const query = { where: { email, isActive: true } };
        const user = await this.usersRepository.findOne(query);
        
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        
        return null;
    }

    @TransformToDto(UserDto)
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, email, ...rest } = createUserDto;
        const userWithSameEmail = await this.usersRepository.findOne({ where: { email } });
        if (userWithSameEmail) {
            throw new Error('User with same email already exists');
        }
        const hashedPassword = await this.hashPassword(password);
        const today = new Date();
        const user = this.usersRepository.create({
            ...rest,
            email,
            password: hashedPassword,
            createdAt: today,
        });

        return this.usersRepository.save(user);
    }

    @TransformToDto(UserDto)
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.preload({
            id,
            ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }
        user.isActive = false;
        try {
            await this.usersRepository.save(user);
        } catch (error) {
            throw new NotFoundException(`User ${id} not removed`);
        }

        return null;
    }

    @TransformToDto(UserDto)
    async reactivate(id: number): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }
        user.isActive = true;
        try {
            await this.usersRepository.save(user);
        } catch (error) {
            throw new NotFoundException(`User ${id} not reactivated`);
        }

        return null;
    }

    private addFilters(queryBuilder: SelectQueryBuilder<User>, filters: UserFiltersDto) {
        const { email, name, isActive, firstLogin, lastLogin, createdAt } = filters;
        
        if (email) {
            queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
        }

        if (name) {
            queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
        }

        if (isActive !== undefined) {
            queryBuilder.andWhere('user.isActive = :isActive', { isActive });
        }

        if (firstLogin) {
            queryBuilder.andWhere('user.firstLogin >= :firstLogin', { firstLogin });
        }

        if (lastLogin) {
            queryBuilder.andWhere('user.lastLogin <= :lastLogin', { lastLogin });
        }

        if (createdAt) {
            queryBuilder.andWhere('user.createdAt >= :createdAt', { createdAt });
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}