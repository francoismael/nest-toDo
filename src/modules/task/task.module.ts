/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './interfaces/task.controller';
import { CreateTaskUsecase } from './application/usecases/create-task.usecase';
import { MongoTaskRepository } from './infrastructure/repositories/mongo-task.repository';
import { TaskSchema } from './infrastructure/schema/task.schema';
import { TaskRepositoryToken } from './application/port/task.repository.token';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../auth/strategies/strategy.jwt';
import { FindAllTasksUseCase } from './application/usecases/find-all-tasks.usecase';
import { UpdateTaskUsecase } from './application/usecases/update-task.usecase';
import { DeleteTaskUseCase } from './application/usecases/delete-task.usecase';
import { UpdateTaskStatusUseCase } from './application/usecases/update-task-status.usecase';
import { UpdateSubTaskStatusUseCase } from './application/usecases/update-subtask-status.usecase';
import { DeleteSubTaskUseCase } from './application/usecases/delete-subtask.usecase';
import { SearchTaskUseCase } from './application/usecases/search-task.usecase';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
  controllers: [TaskController],
  providers: [
    CreateTaskUsecase,
    JwtStrategy,
    FindAllTasksUseCase,
    UpdateSubTaskStatusUseCase,
    DeleteSubTaskUseCase,
    UpdateTaskStatusUseCase,
    SearchTaskUseCase,
    UpdateTaskUsecase,
    DeleteTaskUseCase,
    JwtAuthGuard,

{ provide: TaskRepositoryToken, useClass: MongoTaskRepository }
  ],
  exports: [{ provide: TaskRepositoryToken, useClass: MongoTaskRepository }],
})
export class TaskModule {}
