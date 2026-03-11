import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScheduledTaskRepositoryToken } from '../port/scheduled-task.repository.token';
import { ScheduledTaskRepository } from '../port/scheduled-task.repository.interface';
import { TaskRepositoryToken } from '../../../task/application/port/task.repository.token';
import { TaskRepository } from '../../../task/application/port/task.repository.interface';
import { Task, SubTask } from '../../../task/domain/entities/task';
import { TaskStatusEnum } from '../../../task/interfaces/types/task-status.enum';
import { TaskPriorityEnum } from '../../../task/interfaces/types/task-priority.enum';

@Injectable()
export class GenerateTodayTasksUseCase {
  constructor(
    @Inject(ScheduledTaskRepositoryToken)
    private readonly scheduledRepo: ScheduledTaskRepository,
    @Inject(TaskRepositoryToken)
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();

    const templates = await this.scheduledRepo.findActiveByUserId(userId);
    let count = 0;

    for (const t of templates) {
      if (t.lastGeneratedDate) {
        const last = new Date(t.lastGeneratedDate);
        last.setHours(0, 0, 0, 0);
        if (last.getTime() === today.getTime()) continue;
      }

      let shouldGenerate = false;

      if (t.recurrenceType === 'daily') {
        shouldGenerate = true;
      } else if (
        t.recurrenceType === 'once' &&
        t.scheduledDate &&
        new Date(t.scheduledDate + 'T00:00:00').toDateString() === today.toDateString()
      ) {
        shouldGenerate = true;
      } else if (t.recurrenceType === 'weekly' && Array.isArray(t.daysOfWeek)) {
        shouldGenerate = t.daysOfWeek.includes(todayDay);
      }

      if (!shouldGenerate) continue;

      const startTime = t.startHour ? this.buildDateTime(today, t.startHour) : undefined;
      const endTime = t.endHour ? this.buildDateTime(today, t.endHour) : undefined;

      const subTasks = (t.subTasks ?? []).map(
        (s) => new SubTask(randomUUID(), s.title, TaskStatusEnum.PENDING),
      );

      const task = new Task(
        randomUUID(),
        userId,
        t.title,
        TaskStatusEnum.PENDING,
        t.description,
        startTime,
        endTime,
        subTasks,
        (t.priority as TaskPriorityEnum) ?? TaskPriorityEnum.NORMAL,
        true,
      );

      await this.taskRepo.createTask(task);

      t.lastGeneratedDate = new Date();
      if (t.recurrenceType === 'once') t.isActive = false;
      await this.scheduledRepo.update(t);
      count++;
    }

    return count;
  }

  private buildDateTime(date: Date, hour: string): Date {
    const [h, m] = hour.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  }
}
