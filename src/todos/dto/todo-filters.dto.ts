import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class ToDoFiltersDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    isActive?: boolean;
}