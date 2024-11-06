import { StateDto } from "./state.dto";

export class ToDoDto {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    state: StateDto;
}