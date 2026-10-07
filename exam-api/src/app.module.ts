import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ExamResultsModule } from './exam-results/exam-results.module.js';
import { ExamResult } from './exam-results/entities/exam-result.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // Đọc 'postgres' khi chạy Docker, 'localhost' khi chạy ngoài
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'mysecretpassword',
      database: process.env.DB_NAME || 'gscores',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ExamResultsModule,
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'exam-api',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
