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
    MongooseModule.forRoot('mongodb+srv://franco:franco9006090@cluster0.tpd7c.mongodb.net/ToDo'),
    AuthModule,
    TaskModule,
    ScheduledTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
