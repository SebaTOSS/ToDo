import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosController } from './todos.controller';
import { ToDo, ToDoState } from './entities';
import { ToDosService } from './todos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToDoState, ToDo]),
  ],
  providers: [ToDosService],
  exports: [ToDosService],
  controllers: [TodosController],
})
export class TodoModule { }