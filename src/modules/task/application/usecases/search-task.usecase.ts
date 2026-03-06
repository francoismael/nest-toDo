import { Inject, Injectable } from '@nestjs/common';
import { TaskRepositoryToken } from '../port/task.repository.token';
import { TaskRepository } from '../port/task.repository.interface';
import { SearchTaskDto } from '../../interfaces/dto/search-task.dto';

@Injectable()
export class SearchTaskUseCase {
  constructor(
    @Inject(TaskRepositoryToken)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, dto: SearchTaskDto) {
    return this.taskRepository.findByFilters(userId, {
      keyword: dto.keyword,
      status: dto.status,
    });
  }
}
