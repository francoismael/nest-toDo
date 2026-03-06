import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { CreateScheduledTaskUseCase } from '../application/usecases/create-scheduled-task.usecase';
import { FindAllScheduledTasksUseCase } from '../application/usecases/find-all-scheduled-tasks.usecase';
import { DeleteScheduledTaskUseCase } from '../application/usecases/delete-scheduled-task.usecase';
import { ToggleScheduledTaskUseCase } from '../application/usecases/toggle-scheduled-task.usecase';
import { GenerateTodayTasksUseCase } from '../application/usecases/generate-today-tasks.usecase';

interface RequestWithUser extends Request {
  user: { userId: string };
}

@Controller('scheduled-tasks')
export class ScheduledTaskController {
  constructor(
    private readonly createUseCase: CreateScheduledTaskUseCase,
    private readonly findAllUseCase: FindAllScheduledTasksUseCase,
    private readonly deleteUseCase: DeleteScheduledTaskUseCase,
    private readonly toggleUseCase: ToggleScheduledTaskUseCase,
    private readonly generateUseCase: GenerateTodayTasksUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() dto: CreateScheduledTaskDto) {
    return this.createUseCase.execute({ ...dto, userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.findAllUseCase.execute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle')
  toggle(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.toggleUseCase.execute(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-today')
  generateToday(@Request() req: RequestWithUser) {
    return this.generateUseCase.execute(req.user.userId);
  }
}
