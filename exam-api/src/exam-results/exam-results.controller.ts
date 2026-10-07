import { Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { ExamResultsService } from './services/exam-results.service.js';
import { CsvParserService } from './services/csv-parser.service.js';
import * as path from 'path';

@Controller('api')
export class ExamResultsController {
  constructor(
    private readonly examResultsService: ExamResultsService,
    private readonly csvParserService: CsvParserService,
  ) {}

  @Post('seed')
  async seedData() {
    const csvPath = path.join(process.cwd(), 'dataset', 'diem_thi_thpt_2024.csv');
    // Start seeding asynchronously so the request doesn't timeout for large files
    this.csvParserService.seedFromCsv(csvPath).catch(console.error);
    return { message: 'Seeding started in the background.' };
  }

  @Get('scores/:registration_number')
  async getScore(@Param('registration_number') registrationNumber: string) {
    if (!/^\d+$/.test(registrationNumber)) {
      throw new BadRequestException('Registration number must contain only digits');
    }
    return this.examResultsService.getScore(registrationNumber);
  }

  @Get('reports/statistics')
  async getStatistics() {
    return this.examResultsService.getStatistics();
  }

  @Get('reports/top-group-a')
  async getTopGroupA() {
    return this.examResultsService.getTopGroupA();
  }
}
