import { TaskStatusEnum } from '../types/task-status.enum';

export interface SearchTaskDto {
  keyword?: string;
  status?: TaskStatusEnum;
}
