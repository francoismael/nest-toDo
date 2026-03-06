import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScheduledTaskRepositoryToken } from '../port/scheduled-task.repository.token';
import { ScheduledTaskRepository } from '../port/scheduled-task.repository.interface';
import { ScheduledTask } from '../../domain/entities/scheduled-task';
import { CreateScheduledTaskDto } from '../../interfaces/dto/create-scheduled-task.dto';

@Injectable()
export class CreateScheduledTaskUseCase {
  constructor(
    @Inject(ScheduledTaskRepositoryToken)
    private readonly repo: ScheduledTaskRepository,
  ) {}

  async execute(dto: CreateScheduledTaskDto & { userId: string }): Promise<ScheduledTask> {
    const task = new ScheduledTask(
      randomUUID(),
      dto.userId,
      dto.title,
      dto.recurrenceType,
      true,
      dto.description,
      dto.priority ?? 'normal',
      dto.daysOfWeek ?? [],
      dto.scheduledDate,
      dto.startHour,
      dto.endHour,
      undefined,
      dto.subTasks ?? [],
    );
    return this.repo.create(task);
  }
}
