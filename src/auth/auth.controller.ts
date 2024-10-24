import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, Request } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    async refresh(@Req() req: any) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        return this.authService.refresh(token);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req: any) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        return this.authService.logout(token);
    }
}