import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { User } from './src/users/entities';
import { ToDo, ToDoState } from './src/todos/entities';
import { PopulateTodoStates1729890622527 } from './src/migrations/1729890622527-PopulateTodoStates';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, ToDo, ToDoState],
    migrations: [PopulateTodoStates1729890622527],
    synchronize: false,
    logging: true,
});