import { TaskStatusEnum } from '../types/task-status.enum';
import { TaskPriorityEnum } from '../types/task-priority.enum';

export class CreateSubTaskDto {
  title: string;
  status?: TaskStatusEnum;
}

export class CreateTaskDto {
  userId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  priority?: TaskPriorityEnum;
  subTasks?: {
    title: string;
    status?: TaskStatusEnum;
  }[];
}
