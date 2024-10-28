import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ToDoState } from './todo-state.entity';
import { User } from '../../users/entities';

@Entity()
export class ToDo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    lastUpdate: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => ToDoState)
    state: ToDoState;
}