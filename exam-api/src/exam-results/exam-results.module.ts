import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResult } from './entities/exam-result.entity.js';
import { ExamResultsController } from './exam-results.controller.js';
import { ExamResultsService } from './services/exam-results.service.js';
import { CsvParserService } from './services/csv-parser.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult])],
  controllers: [ExamResultsController],
  providers: [ExamResultsService, CsvParserService],
})
export class ExamResultsModule {}
