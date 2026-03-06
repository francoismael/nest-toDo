import { Inject, Injectable } from '@nestjs/common';
import { ScheduledTaskRepositoryToken } from '../port/scheduled-task.repository.token';
import { ScheduledTaskRepository } from '../port/scheduled-task.repository.interface';

@Injectable()
export class DeleteScheduledTaskUseCase {
  constructor(
    @Inject(ScheduledTaskRepositoryToken)
    private readonly repo: ScheduledTaskRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
