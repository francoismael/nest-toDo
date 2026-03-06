import { Inject, Injectable } from '@nestjs/common';
import { ScheduledTaskRepositoryToken } from '../port/scheduled-task.repository.token';
import { ScheduledTaskRepository } from '../port/scheduled-task.repository.interface';
import { ScheduledTask } from '../../domain/entities/scheduled-task';

@Injectable()
export class ToggleScheduledTaskUseCase {
  constructor(
    @Inject(ScheduledTaskRepositoryToken)
    private readonly repo: ScheduledTaskRepository,
  ) {}

  async execute(id: string, userId: string): Promise<ScheduledTask> {
    const tasks = await this.repo.findAllByUserId(userId);
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('ScheduledTask not found');
    task.isActive = !task.isActive;
    return this.repo.update(task);
  }
}
