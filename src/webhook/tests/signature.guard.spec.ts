import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignatureGuard } from '../signature.guard';
import { SignatureService } from '../signature.service';

describe('SignatureGuard', () => {
  let guard: SignatureGuard;
  let signatureService: SignatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureGuard,
        {
          provide: SignatureService,
          useValue: {
            verifySignature: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<SignatureGuard>(SignatureGuard);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request with valid signature', () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-signature': 'valid-signature',
            'x-timestamp': '2023-10-01T12:00:00Z',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(signatureService, 'verifySignature').mockReturnValue(true);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw BadRequestException for invalid signature', () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-signature': 'invalid-signature',
            'x-timestamp': '2023-10-01T12:00:00Z',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(signatureService, 'verifySignature').mockReturnValue(false);

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
  });
});