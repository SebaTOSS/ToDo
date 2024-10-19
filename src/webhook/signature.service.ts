import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service that handles the generation and verification of signatures.
 * 
 * This service currently verifies a signature by comparing it to a secret string.
 * In the future, it should be enhanced to validate the signature in a more complex manner,
 * such as using HMAC or other cryptographic methods.
 */
@Injectable()
export class SignatureService {
  private secret: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('SIGNATURE');
  }

  /**
   * Generates a HMAC SHA-256 signature.
   * 
   * @returns {string} The generated signature.
   */
  generateSignature(): string {
    const hmac = crypto.createHmac('sha256', this.secret);

    return hmac.digest('hex');
  }

  /**
   * Verifies the provided signature.
   * 
   * Currently, this method verifies the signature by comparing it to a secret string.
   * In the future, this method should be enhanced to validate the signature in a more complex manner.
   * 
   * @param {string} signature - The signature to verify.
   * @returns {boolean} True if the signature is valid, false otherwise.
   */
  verifySignature(signature: string): boolean {
    return signature === this.secret;
  }
}