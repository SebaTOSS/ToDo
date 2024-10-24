import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedToken } from './entities';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(RevokedToken)
        private readonly revokedTokenRepository: Repository<RevokedToken>,
    ) { }

    async revokeToken(token: string): Promise<void> {
        const revokedToken = new RevokedToken();
        revokedToken.token = token;
        
        await this.revokedTokenRepository.save(revokedToken);
    }

    async isTokenRevoked(token: string): Promise<boolean> {
        const revokedToken = await this.revokedTokenRepository.findOneBy({ token });
        
        return !!revokedToken;
    }
}