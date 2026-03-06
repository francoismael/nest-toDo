import { Inject, Injectable } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';

@Injectable()
export class FindAllTasksUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string) {
    return this.taskRepository.findAllByUserId(userId);
  }
}
