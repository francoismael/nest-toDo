import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateTaskUsecase } from '../application/usecases/create-task.usecase';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindAllTasksUseCase } from '../application/usecases/find-all-tasks.usecase';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskUsecase } from '../application/usecases/update-task.usecase';
import { DeleteTaskUseCase } from '../application/usecases/delete-task.usecase';
import { UpdateTaskStatusUseCase } from '../application/usecases/update-task-status.usecase';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateSubTaskStatusUseCase } from '../application/usecases/update-subtask-status.usecase';
import { UpdateSubTaskStatusDto } from './dto/update-subtask-status.dto';
import { DeleteSubTaskUseCase } from '../application/usecases/delete-subtask.usecase';
import { SearchTaskUseCase } from '../application/usecases/search-task.usecase';
import { SearchTaskDto } from './dto/search-task.dto';

interface RequestWithUser extends Request {
  user: { userId: string; username?: string };
}

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUsecase,
    private readonly findAllTasksUsecase: FindAllTasksUseCase,
    private readonly updateTaskUsecase: UpdateTaskUsecase,
    private readonly deleteTaskUsecase: DeleteTaskUseCase,
    private readonly updateTaskStatus: UpdateTaskStatusUseCase,
    private readonly updateSubtaskStatus: UpdateSubTaskStatusUseCase,
    private readonly deleteSubtask: DeleteSubTaskUseCase,
    private readonly searchTask: SearchTaskUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('createTask')
  async create(@Request() req: RequestWithUser, @Body() dto: CreateTaskDto) {
    return this.createTaskUseCase.execute({ ...dto, userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('findAll')
  async findAll(@Request() req: RequestWithUser) {
    return this.findAllTasksUsecase.execute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateTask/:id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.updateTaskUsecase.execute(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteTask/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') taskId: string) {
    return this.deleteTaskUsecase.execute(taskId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatusTask(
    @Param('id') taskId: string,
    @Request() req: RequestWithUser,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.updateTaskStatus.execute(taskId, req.user.userId, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/subtasks/:subTaskId/status')
  updateSubTaskStatus(
    @Param('taskId') taskId: string,
    @Param('subTaskId') subTaskId: string,
    @Request() req: RequestWithUser,
    @Body() dto: UpdateSubTaskStatusDto,
  ) {
    return this.updateSubtaskStatus.execute(
      taskId,
      subTaskId,
      req.user.userId,
      dto.status,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId/subtasks/:subTaskId')
  deleteSubTask(
    @Param('taskId') taskId: string,
    @Param('subTaskId') subTaskId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.deleteSubtask.execute(taskId, req.user.userId, subTaskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Request() req: RequestWithUser, @Query() query: SearchTaskDto) {
    return this.searchTask.execute(req.user.userId, query);
  }
}
