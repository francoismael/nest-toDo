import { Inject, Injectable } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { CreateTaskDto } from '../../interfaces/dto/create-task.dto';
import { SubTask, Task } from '../../domain/entities/task';
import { randomUUID } from 'crypto';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';
import { TaskPriorityEnum } from '../../interfaces/types/task-priority.enum';

@Injectable()
export class CreateTaskUsecase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    const subTasks =
      dto.subTasks?.map(
        (sub) =>
          new SubTask(
            randomUUID(),
            sub.title,
            sub.status ?? TaskStatusEnum.PENDING,
          ),
      ) ?? [];

    const task = new Task(
      randomUUID(),
      dto.userId,
      dto.title,
      TaskStatusEnum.PENDING,
      dto.description,
      dto.startTime ? new Date(dto.startTime) : undefined,
      dto.endTime ? new Date(dto.endTime) : undefined,
      subTasks,
      dto.priority ?? TaskPriorityEnum.NORMAL,
    );

    return this.taskRepository.createTask(task);
  }
}
