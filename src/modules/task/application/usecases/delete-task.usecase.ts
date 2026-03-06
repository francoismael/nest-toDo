import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(taskId: string, userId: string): Promise<{ message: string }> {
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or not authorized');
    }

    await this.taskRepository.deleteTask(taskId);
    return { message: 'Taches supprimer avec succée' };
  }
}
