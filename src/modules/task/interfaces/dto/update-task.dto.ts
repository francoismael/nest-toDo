import { TaskStatusEnum } from '../types/task-status.enum';
import { TaskPriorityEnum } from '../types/task-priority.enum';

export class UpdateSubTaskDto {
  id?: string;
  title?: string;
  status: TaskStatusEnum;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
  subTasks?: UpdateSubTaskDto[];
}
