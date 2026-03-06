import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { UpdateTaskDto } from '../../interfaces/dto/update-task.dto';
import { Task, SubTask } from '../../domain/entities/task';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateTaskUsecase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository.findTaskById(taskId);

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or not authorized');
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.startTime !== undefined) task.startTime = new Date(dto.startTime);
    if (dto.endTime !== undefined) task.endTime = new Date(dto.endTime);
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;

    if (dto.subTasks) {
      dto.subTasks.forEach((subDto) => {
        if (subDto.id) {
          const subTask = task.subTasks.find((s) => s.id === subDto.id);
          if (subTask) {
            if (subDto.title !== undefined) subTask.title = subDto.title;
            if (subDto.status !== undefined) subTask.status = subDto.status;
          }
        } else {
          task.subTasks.push(
            new SubTask(
              randomUUID(),
              subDto.title || 'Nouvelle sous-tâche',
              subDto.status || 'pending',
            ),
          );
        }
      });
    }

    return this.taskRepository.updateTask(task);
  }
}
