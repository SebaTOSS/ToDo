import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities';
import { CreateUserDto } from '../../users/dto';
import { LoginUserDto } from '../dto';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let tokenService: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            if (key === 'SIGNATURE') {
                                return 'test-secret';
                            }
                        }),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findOneByEmailAndPassword: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        decode: jest.fn(),
                        sign: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        revokeToken: jest.fn(),
                        isTokenRevoked: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findOneByEmailAndPassword: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        decode: jest.fn(),
                        sign: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        revokeToken: jest.fn(),
                        isTokenRevoked: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        tokenService = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com', password: 'password', name: 'Test',
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
            jest.spyOn(usersService, 'create').mockResolvedValue(result);

            expect(await authService.register(createUserDto)).toBe(result);
        });
    });

    describe('logout', () => {
        it('should revoke the token', async () => {
            const token = 'test-token';
            jest.spyOn(tokenService, 'revokeToken').mockResolvedValue(undefined);

            await authService.logout(token);
            expect(tokenService.revokeToken).toHaveBeenCalledWith(token);
        });
    });

    describe('refresh', () => {
        it('should refresh the access token', async () => {
            const token = 'test-token';
            const payload = { sub: 1, email: 'test@example.com' };
            const newAccessToken = 'new-access-token';

            jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValue(false);
            jest.spyOn(jwtService, 'decode').mockReturnValue(payload);
            jest.spyOn(jwtService, 'sign').mockReturnValue(newAccessToken);
            jest.spyOn(tokenService, 'revokeToken').mockResolvedValue(undefined);

            const result = await authService.refresh(token);
            expect(result).toEqual({ accessToken: newAccessToken });
            expect(tokenService.revokeToken).toHaveBeenCalledWith({ id: payload.sub, email: payload.email });
        });

        it('should throw an UnauthorizedException if the token is revoked', async () => {
            const token = 'test-token';

            jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValue(true);

            await expect(authService.refresh(token)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw an UnauthorizedException if the token is invalid', async () => {
            const token = 'test-token';

            jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValue(false);
            jest.spyOn(jwtService, 'decode').mockReturnValue(null);

            await expect(authService.refresh(token)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should revoke login because user not exists', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'invalid@test.com',
                password: 'invalid',
            };
            jest.spyOn(usersService, 'findOneByEmailAndPassword').mockResolvedValue(null)

            expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException)
        });

        it('should login successfully', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'valid@test.com',
                password: 'valid',
            };
            const user: User = {
                id: 1,
                email: 'valid@test.com',
                name: 'testing',
                password: 'valid',
                isActive: true,
                createdAt: new Date(),
                firstLogin: null,
                lastLogin: null,
            };
            jest.spyOn(usersService, 'findOneByEmailAndPassword').mockResolvedValue(user);
            jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

            const result = await authService.login(loginUserDto);
            expect(result).toEqual({ accessToken: 'test-token', refreshToken: 'test-token' });
        });
    });
});