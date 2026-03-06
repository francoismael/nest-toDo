import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { Task } from '../../domain/entities/task';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';

@Injectable()
export class UpdateSubTaskStatusUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    taskId: string,
    subTaskId: string,
    userId: string,
    status: TaskStatusEnum,
  ): Promise<Task> {
    const task = await this.taskRepository.findTaskById(taskId);

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    const subTask = task.subTasks.find((s) => s.id === subTaskId);

    if (!subTask) {
      throw new NotFoundException('SubTask not found');
    }

    subTask.status = status;

    return this.taskRepository.updateTask(task);
  }
}
