import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { Request } from 'express';
import { JwtStrategy } from '../jwt.strategy';
import { TokenService } from '../../token.service';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let tokenService: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
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
                    provide: TokenService,
                    useValue: {
                        isTokenRevoked: jest.fn(),
                    },
                },
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        tokenService = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    it('should validate and return the user payload', async () => {
        const payload = { sub: 1, email: 'test@example.com' };
        const req = mock<Request>();
        req.headers.authorization = 'Bearer test-token';

        jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValue(false);

        const result = await jwtStrategy.validate(req, payload);
        expect(result).toEqual({ id: payload.sub, email: payload.email });
    });

    it('should throw an UnauthorizedException if the token is revoked', async () => {
        const payload = { sub: 1, email: 'test@example.com' };
        const req = mock<Request>();
        req.headers.authorization = 'Bearer test-token';

        jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValue(true);

        await expect(jwtStrategy.validate(req, payload)).rejects.toThrow(UnauthorizedException);
    });
});