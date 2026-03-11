import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TaskRepository } from '../../application/port/task.repository.interface';
import { Task, SubTask } from '../../domain/entities/task';
import { TaskDocument } from '../schema/task.schema';
import { error } from 'console';
import { TaskStatusEnum } from '../../interfaces/types/task-status.enum';
import { TaskPriorityEnum } from '../../interfaces/types/task-priority.enum';

@Injectable()
export class MongoTaskRepository implements TaskRepository {
  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async createTask(task: Task): Promise<Task> {
    const created = new this.taskModel({
      userId: task.userId,
      title: task.title,
      description: task.description,
      startTime: task.startTime,
      endTime: task.endTime,
      status: task.status,
      priority: task.priority,
      isScheduled: task.isScheduled,
      subTasks: task.subTasks.map((sub) => ({
        title: sub.title,
        status: sub.status,
      })),
    });

    const saved = await created.save();

    return new Task(
      saved._id.toString(),
      saved.userId,
      saved.title,
      saved.status,
      saved.description,
      saved.startTime,
      saved.endTime,
      saved.subTasks.map(
        (sub) => new SubTask(sub._id.toString(), sub.title, sub.status),
      ),
      saved.priority ?? TaskPriorityEnum.NORMAL,
      saved.isScheduled ?? false,
    );
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ userId }).exec();

    return tasks.map(
      (task) =>
        new Task(
          task._id.toString(),
          task.userId,
          task.title,
          task.status,
          task.description,
          task.startTime,
          task.endTime,
          task.subTasks.map(
            (sub) => new SubTask(sub._id.toString(), sub.title, sub.status),
          ),
          task.priority ?? TaskPriorityEnum.NORMAL,
          task.isScheduled ?? false,
        ),
    );
  }

  async updateTask(task: Task): Promise<Task> {
    const updated = await this.taskModel
      .findByIdAndUpdate(
        task.id,
        {
          title: task.title,
          description: task.description,
          startTime: task.startTime,
          endTime: task.endTime,
          status: task.status,
          priority: task.priority,
          subTasks: task.subTasks.map((sub) => {
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(sub.id ?? '');
            return {
              ...(isValidObjectId ? { _id: sub.id } : {}),
              title: sub.title,
              status: sub.status,
            };
          }),
        },
        { new: true },
      )
      .exec();

    if (!updated) throw new Error('Task not found');

    return new Task(
      updated._id.toString(),
      updated.userId,
      updated.title,
      updated.status,
      updated.description,
      updated.startTime,
      updated.endTime,
      updated.subTasks?.map(
        (sub) => new SubTask(sub._id.toString(), sub.title, sub.status),
      ) ?? [],
      updated.priority ?? TaskPriorityEnum.NORMAL,
    );
  }

  async findTaskById(taskId: string): Promise<Task | null> {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) return null;

    return new Task(
      task._id.toString(),
      task.userId,
      task.title,
      task.status,
      task.description,
      task.startTime,
      task.endTime,
      task.subTasks?.map(
        (sub) => new SubTask(sub._id.toString(), sub.title, sub.status),
      ) ?? [],
      task.priority ?? TaskPriorityEnum.NORMAL,
      task.isScheduled ?? false,
    );
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(taskId).exec();
    if (!result) {
      throw new error('Aucune taches trouvé');
    }
  }

  async findByFilters(
    userId: string,
    filters: {
      keyword?: string;
      status?: TaskStatusEnum;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Task[]> {
    const query: FilterQuery<TaskDocument> = { userId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.keyword) {
      query.$or = [
        { title: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } },
      ];
    }

    const tasks = await this.taskModel.find(query).exec();

    return tasks.map(
      (task) =>
        new Task(
          task._id.toString(),
          task.userId,
          task.title,
          task.status,
          task.description,
          task.startTime,
          task.endTime,
          task.subTasks?.map(
            (sub) => new SubTask(sub._id.toString(), sub.title, sub.status),
          ) ?? [],
          task.priority ?? TaskPriorityEnum.NORMAL,
          task.isScheduled ?? false,
        ),
    );
  }
}
