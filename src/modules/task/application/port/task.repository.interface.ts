import { Task } from '../../domain/entities/task';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';

export interface TaskRepository {
  createTask(task: Task): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
  findTaskById(taskId: string): Promise<Task | null>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  findByFilters(
    userId: string,
    filters: {
      keyword?: string;
      status?: TaskStatusEnum;
    },
  ): Promise<Task[]>;
}
