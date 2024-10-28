import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateToDoDto {
    @ApiProperty({ example: 'Feature: add documentation' })
    @IsString()
    @MinLength(6)
    readonly title: string;
    
    @ApiProperty({ example: 'Add API documentation' })
    @IsString()
    @MinLength(10)
    readonly description: string;
    
    @ApiProperty({ example: '1' })
    @IsNumber()
    @IsPositive()
    readonly state: number;
}
