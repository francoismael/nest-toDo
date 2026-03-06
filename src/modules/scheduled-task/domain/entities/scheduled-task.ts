export type RecurrenceType = 'once' | 'daily' | 'weekly';

export class ScheduledTask {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public recurrenceType: RecurrenceType,
    public isActive: boolean = true,
    public description?: string,
    public priority?: string,
    public daysOfWeek?: number[], // [0,1,2,3,4,5,6] = jours de la semaine
    public scheduledDate?: string,
    public startHour?: string, // "HH:MM" partagé pour tous les types
    public endHour?: string, // "HH:MM" partagé pour tous les types
    public lastGeneratedDate?: Date,
    public subTasks?: { title: string }[],
  ) {}
}
