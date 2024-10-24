import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Token } from './decorators';
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
    async refresh(@Token() token: string) {
        return this.authService.refresh(token);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Token() token: string) {
        return this.authService.logout(token);
    }
}