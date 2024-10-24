import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        
        return token;
    },
);