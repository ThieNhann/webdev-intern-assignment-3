import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamResult } from '../entities/exam-result.entity.js';
import { SubjectManager } from './subject.manager.js';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectRepository(ExamResult)
    private examResultRepository: Repository<ExamResult>,
  ) { }

  private cachedStatistics: any = null;
  private cachedTopGroupA: any = null;

  async getScore(registrationNumber: string): Promise<ExamResult> {
    const result = await this.examResultRepository.findOne({
      where: { registration_number: registrationNumber },
    });
    if (!result) {
      throw new NotFoundException(`Score for registration number ${registrationNumber} not found`);
    }
    return result;
  }

  async getTopGroupA(): Promise<any[]> {
    if (this.cachedTopGroupA) return this.cachedTopGroupA;

    const result = await this.examResultRepository
      .createQueryBuilder('exam_result')
      .select(['registration_number', 'math', 'physics', 'chemistry'])
      .addSelect('(math + physics + chemistry)', 'total')
      .where('math IS NOT NULL')
      .andWhere('physics IS NOT NULL')
      .andWhere('chemistry IS NOT NULL')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany();
    this.cachedTopGroupA = result;
    return result;
  }

  async getStatistics(): Promise<any> {
    if (this.cachedStatistics) return this.cachedStatistics;
    
    const subjectManager = new SubjectManager();
    const subjects = subjectManager.getAllSubjects();

    const query = this.examResultRepository.createQueryBuilder('exam_result');

    query.select('1', 'dummy');

    subjects.forEach((subject) => {
      const selectQueries = subject.getSelectQueries();
      selectQueries.forEach(({ query: sql, alias }) => {
        query.addSelect(sql, alias);
      });
    });

    try {
      const result = await query.getRawOne();

      // Format the response
      const formattedResult: any = {};
      subjects.forEach(subject => {
        formattedResult[subject.name] = {
          '>=8': parseInt(result[`${subject.name}_level_1`], 10) || 0,
          '6-8': parseInt(result[`${subject.name}_level_2`], 10) || 0,
          '4-6': parseInt(result[`${subject.name}_level_3`], 10) || 0,
          '<4': parseInt(result[`${subject.name}_level_4`], 10) || 0,
        };
      });

      this.cachedStatistics = formattedResult;
      return formattedResult;
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }
}
