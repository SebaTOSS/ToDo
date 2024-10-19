import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SignatureService } from '../signature.service';

describe('SignatureService', () => {
  let service: SignatureService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a valid signature', () => {
    const signature = service.generateSignature();
    expect(signature).toBeDefined();
    expect(signature).toHaveLength(64); // SHA-256 produces a 64-character hex string
  });

  it('should verify a valid signature', () => {
    const validSignature = 'test-secret';
    const result = service.verifySignature(validSignature);
    expect(result).toBe(true);
  });

  it('should not verify an invalid signature', () => {
    const invalidSignature = 'invalid-secret';
    const result = service.verifySignature(invalidSignature);
    expect(result).toBe(false);
  });
});