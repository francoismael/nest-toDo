import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledTaskRepository } from '../../application/port/scheduled-task.repository.interface';
import { ScheduledTask } from '../../domain/entities/scheduled-task';
import { ScheduledTaskDocument } from '../schema/scheduled-task.schema';

@Injectable()
export class MongoScheduledTaskRepository implements ScheduledTaskRepository {
  constructor(
    @InjectModel('ScheduledTask')
    private readonly model: Model<ScheduledTaskDocument>,
  ) {}

  private toEntity(doc: ScheduledTaskDocument): ScheduledTask {
    return new ScheduledTask(
      (doc as any)._id.toString(),
      doc.userId,
      doc.title,
      doc.recurrenceType as any,
      doc.isActive,
      doc.description,
      doc.priority,
      doc.daysOfWeek,
      doc.scheduledDate,
      doc.startHour,
      doc.endHour,
      doc.lastGeneratedDate,
      doc.subTasks,
    );
  }

  async create(task: ScheduledTask): Promise<ScheduledTask> {
    const created = new this.model({
      userId: task.userId,
      title: task.title,
      recurrenceType: task.recurrenceType,
      isActive: task.isActive,
      description: task.description,
      priority: task.priority,
      daysOfWeek: task.daysOfWeek ?? [],
      scheduledDate: task.scheduledDate,
      startHour: task.startHour,
      endHour: task.endHour,
      subTasks: task.subTasks ?? [],
    });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findAllByUserId(userId: string): Promise<ScheduledTask[]> {
    const docs = await this.model.find({ userId }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findActiveByUserId(userId: string): Promise<ScheduledTask[]> {
    const docs = await this.model.find({ userId, isActive: true }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async update(task: ScheduledTask): Promise<ScheduledTask> {
    const updated = await this.model
      .findByIdAndUpdate(
        task.id,
        {
          isActive: task.isActive,
          lastGeneratedDate: task.lastGeneratedDate,
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new Error('ScheduledTask not found');
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
