/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { ScheduledTaskModule } from './modules/scheduled-task/scheduled-task.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGODB_URI'] as string),
    AuthModule,
    TaskModule,
    ScheduledTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
