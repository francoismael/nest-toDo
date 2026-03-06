export class CreateScheduledTaskDto {
  title: string;
  recurrenceType: 'once' | 'daily' | 'weekly';
  description?: string;
  priority?: string;
  daysOfWeek?: number[];
  scheduledDate?: string;
  startHour?: string;
  endHour?: string;
  subTasks?: { title: string }[];
}
