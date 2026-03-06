import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';
import { TaskPriorityEnum } from '../../interfaces/types/task-priority.enum';

export class Task {
  public subTasks: SubTask[];

  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public status: TaskStatusEnum,
    public description?: string,
    public startTime?: Date,
    public endTime?: Date,
    subTasks?: SubTask[],
    public priority: TaskPriorityEnum = TaskPriorityEnum.NORMAL,
  ) {
    this.subTasks = subTasks ?? [];
  }
}

export class SubTask {
  constructor(
    public id: string,
    public title: string,
    public status: TaskStatusEnum,
  ) {}
}
