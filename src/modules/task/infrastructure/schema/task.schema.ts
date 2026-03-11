import { Schema, Document, Types } from 'mongoose';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';
import { TaskPriorityEnum } from '../../interfaces/types/task-priority.enum';

export interface TaskDocument extends Document<Types.ObjectId> {
  userId: string;
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  isScheduled: boolean;
  subTasks: {
    _id: Types.ObjectId;
    title: string;
    status: TaskStatusEnum;
  }[];
}

export const TaskSchema = new Schema<TaskDocument>(
  {
    userId: { type: String, required: true },

    title: { type: String, required: true },

    description: { type: String },

    startTime: { type: Date },

    endTime: { type: Date },

    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.PENDING,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriorityEnum),
      default: TaskPriorityEnum.NORMAL,
    },

    isScheduled: { type: Boolean, default: false },

    subTasks: [
      {
        title: { type: String, required: true },
        status: {
          type: String,
          enum: Object.values(TaskStatusEnum),
          default: TaskStatusEnum.PENDING,
        },
      },
    ],
  },
  { timestamps: true },
);
