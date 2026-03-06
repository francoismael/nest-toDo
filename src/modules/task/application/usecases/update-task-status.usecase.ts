import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { Task } from '../../domain/entities/task';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    status: TaskStatusEnum,
  ): Promise<Task> {
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    task.status = status;

    return this.taskRepository.updateTask(task);
  }
}
