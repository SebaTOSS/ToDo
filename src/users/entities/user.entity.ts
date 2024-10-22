import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    firstLogin: Date;

    @Column({ nullable: true })
    lastLogin: Date;

    @Column({ default: true })
    isActive: boolean;
}