import { Inject, Injectable } from '@nestjs/common';
import { ScheduledTaskRepositoryToken } from '../port/scheduled-task.repository.token';
import { ScheduledTaskRepository } from '../port/scheduled-task.repository.interface';
import { ScheduledTask } from '../../domain/entities/scheduled-task';

@Injectable()
export class FindAllScheduledTasksUseCase {
  constructor(
    @Inject(ScheduledTaskRepositoryToken)
    private readonly repo: ScheduledTaskRepository,
  ) {}

  async execute(userId: string): Promise<ScheduledTask[]> {
    return this.repo.findAllByUserId(userId);
  }
}
