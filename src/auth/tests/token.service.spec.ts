import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../token.service';
import { RevokedToken } from '../entities';

describe('TokenService', () => {
  let tokenService: TokenService;
  let revokedTokenRepository: Repository<RevokedToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(RevokedToken),
          useClass: Repository,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    revokedTokenRepository = module.get<Repository<RevokedToken>>(getRepositoryToken(RevokedToken));
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('revokeToken', () => {
    it('should save the revoked token', async () => {
      const token = 'test-token';
      const saveSpy = jest.spyOn(revokedTokenRepository, 'save').mockResolvedValue(undefined);

      await tokenService.revokeToken(token);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ token }));
    });
  });

  describe('isTokenRevoked', () => {
    it('should return true if the token is revoked', async () => {
      const token = 'test-token';
      jest.spyOn(revokedTokenRepository, 'findOneBy').mockResolvedValue(new RevokedToken());

      const result = await tokenService.isTokenRevoked(token);
      expect(result).toBe(true);
    });

    it('should return false if the token is not revoked', async () => {
      const token = 'test-token';
      jest.spyOn(revokedTokenRepository, 'findOneBy').mockResolvedValue(null);

      const result = await tokenService.isTokenRevoked(token);
      expect(result).toBe(false);
    });
  });
});