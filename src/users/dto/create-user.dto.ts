import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    readonly name: string;
    
    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    readonly email: string;
    
    @ApiProperty({ example: 'user@example.com' })
    @IsString()
    @IsEmail()
    readonly password: string;
}
