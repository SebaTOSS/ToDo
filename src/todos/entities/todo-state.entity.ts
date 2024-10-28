import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ToDoState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}