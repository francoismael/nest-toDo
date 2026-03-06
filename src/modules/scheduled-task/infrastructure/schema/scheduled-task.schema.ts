import { Schema, Document, Types } from 'mongoose';

export interface ScheduledTaskDocument extends Document<Types.ObjectId> {
  userId: string;
  title: string;
  recurrenceType: string;
  isActive: boolean;
  description?: string;
  priority?: string;
  daysOfWeek?: number[];
  scheduledDate?: string;
  startHour?: string;
  endHour?: string;
  lastGeneratedDate?: Date;
  subTasks: { title: string }[];
}

export const ScheduledTaskSchema = new Schema<ScheduledTaskDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    recurrenceType: { type: String, enum: ['once', 'daily', 'weekly'], required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'normal', 'urgent'], default: 'normal' },
    daysOfWeek: [{ type: Number }],
    scheduledDate: { type: String },
    startHour: { type: String },
    endHour: { type: String },
    lastGeneratedDate: { type: Date },
    subTasks: [{ title: { type: String, required: true } }],
  },
  { timestamps: true },
);
