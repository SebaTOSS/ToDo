import { IsOptional, IsString, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class UserFiltersDto {
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsDateString()
    firstLogin?: Date;

    @IsOptional()
    @IsDateString()
    lastLogin?: Date;

    @IsOptional()
    @IsDateString()
    createdAt?: Date;
}