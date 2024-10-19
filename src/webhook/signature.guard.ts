import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { SignatureService } from './signature.service';

/**
 * Guard that validates the signature of incoming requests.
 * This guard ensures that only requests with a valid signature are processed.
 */
@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private readonly signatureService: SignatureService) { }

  /**
 * Determines whether the current request is allowed to proceed.
 * 
 * @param {ExecutionContext} context - The execution context of the request.
 * @returns {boolean} - Returns true if the request is allowed to proceed, otherwise throws an exception.
 * 
 * @throws {BadRequestException} - If the signature is invalid.
 */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];

    if (!this.signatureService.verifySignature(signature)) {
      throw new BadRequestException('Invalid signature');
    }

    return true;
  }
}