import { ScheduledTask } from '../../domain/entities/scheduled-task';

export interface ScheduledTaskRepository {
  create(task: ScheduledTask): Promise<ScheduledTask>;
  findAllByUserId(userId: string): Promise<ScheduledTask[]>;
  findActiveByUserId(userId: string): Promise<ScheduledTask[]>;
  update(task: ScheduledTask): Promise<ScheduledTask>;
  delete(id: string): Promise<void>;
}
