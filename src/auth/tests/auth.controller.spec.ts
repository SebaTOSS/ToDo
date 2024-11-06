import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../dto';
import { User } from '../../users/entities';
import { CreateUserDto } from '../../users/dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                        refresh: jest.fn(),
                        logout: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: "testing",
                email: 'test@example.com',
                password: 'password',
            };
            const result: User = {
                id: 1,
                email: 'test@example.com',
                name: 'testing',
                password: 'password',
                isActive: true,
                createdAt: new Date(),
                firstLogin: null,
                lastLogin: null,
            };
            jest.spyOn(authService, 'register').mockResolvedValue(result);

            expect(await authController.register(createUserDto)).toBe(result);
        });
    });

    describe('login', () => {
        it('should login a user', async () => {
            const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
            const result = { accessToken: 'access-token', refreshToken: 'refresh-token' };
            jest.spyOn(authService, 'login').mockResolvedValue(result);

            expect(await authController.login(loginUserDto)).toBe(result);
        });
    });

    describe('refresh', () => {
        it('should refresh the access token', async () => {
            const token = 'refresh-token';
            const result = { accessToken: 'new-access-token' };
            jest.spyOn(authService, 'refresh').mockResolvedValue(result);

            expect(await authController.refresh(token)).toBe(result);
        });

        it('should throw an UnauthorizedException if the token is invalid', async () => {
            const token = 'invalid-token';
            jest.spyOn(authService, 'refresh').mockRejectedValue(new UnauthorizedException());

            await expect(authController.refresh(token)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should logout a user', async () => {
            const token = 'access-token';
            jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

            expect(await authController.logout(token)).toBeUndefined();
        });
    });
});