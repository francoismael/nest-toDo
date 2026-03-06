import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduledTaskController } from './interfaces/scheduled-task.controller';
import { CreateScheduledTaskUseCase } from './application/usecases/create-scheduled-task.usecase';
import { FindAllScheduledTasksUseCase } from './application/usecases/find-all-scheduled-tasks.usecase';
import { DeleteScheduledTaskUseCase } from './application/usecases/delete-scheduled-task.usecase';
import { ToggleScheduledTaskUseCase } from './application/usecases/toggle-scheduled-task.usecase';
import { GenerateTodayTasksUseCase } from './application/usecases/generate-today-tasks.usecase';
import { MongoScheduledTaskRepository } from './infrastructure/repositories/mongo-scheduled-task.repository';
import { ScheduledTaskSchema } from './infrastructure/schema/scheduled-task.schema';
import { ScheduledTaskRepositoryToken } from './application/port/scheduled-task.repository.token';
import { TaskModule } from '../task/task.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../auth/strategies/strategy.jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ScheduledTask', schema: ScheduledTaskSchema }]),
    TaskModule,
  ],
  controllers: [ScheduledTaskController],
  providers: [
    CreateScheduledTaskUseCase,
    FindAllScheduledTasksUseCase,
    DeleteScheduledTaskUseCase,
    ToggleScheduledTaskUseCase,
    GenerateTodayTasksUseCase,
    JwtAuthGuard,
    JwtStrategy,
    { provide: ScheduledTaskRepositoryToken, useClass: MongoScheduledTaskRepository },
  ],
})
export class ScheduledTaskModule {}
