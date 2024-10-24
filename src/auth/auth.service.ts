import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { LoginUserDto } from './dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
    ) { }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.usersService.findOneByEmailAndPassword(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = this.buildTokenPayload(user);
        const accessToken = this.buildAccessToken(payload);
        const refreshToken = this.buildRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(token: string) {
        const isRevoked = await this.tokenService.isTokenRevoked(token);
        if (isRevoked) {
            throw new UnauthorizedException('Token has been revoked');
        }

        const payload = this.jwtService.decode(token);
        if (!payload) {
            throw new UnauthorizedException('Invalid token');
        }

        const user: any = { id: payload.sub, email: payload.email };
        await this.tokenService.revokeToken(user);

        const accessToken = this.buildAccessToken(payload);

        return { accessToken };
    }

    async logout(token: string) {
        await this.tokenService.revokeToken(token);
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    private buildTokenPayload(user: any) {
        return { email: user.email, sub: user.id };
    }

    private buildAccessToken(payload: any) {
        const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN');
        
        return this.jwtService.sign(payload, { expiresIn });
    }

    private buildRefreshToken(payload: any) {
        const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN');
        
        return this.jwtService.sign(payload, { expiresIn });
    }
}