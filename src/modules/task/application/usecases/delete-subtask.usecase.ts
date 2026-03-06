import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { Task } from '../../domain/entities/task';

@Injectable()
export class DeleteSubTaskUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    subTaskId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findTaskById(taskId);

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    const initialLength = task.subTasks.length;

    task.subTasks = task.subTasks.filter((s) => s.id !== subTaskId);

    if (task.subTasks.length === initialLength) {
      throw new NotFoundException('SubTask not found');
    }

    return this.taskRepository.updateTask(task);
  }
}
