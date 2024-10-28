import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateToDoDto {
    @ApiProperty({ example: 'Feature: add documentation' })
    @IsString()
    @MinLength(6)
    @IsOptional()
    readonly title?: string;
    
    @ApiProperty({ example: 'Add API documentation' })
    @IsString()
    @MinLength(10)
    @IsOptional()
    readonly description?: string;
    
    @ApiProperty({ example: '1' })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    readonly state?: number;
}
