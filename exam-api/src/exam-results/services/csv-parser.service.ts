import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamResult } from '../entities/exam-result.entity.js';
import * as fs from 'fs';
import csvParser from 'csv-parser';

@Injectable()
export class CsvParserService {
  private readonly logger = new Logger(CsvParserService.name);

  constructor(
    @InjectRepository(ExamResult)
    private examResultRepository: Repository<ExamResult>,
  ) {}

  async seedFromCsv(filePath: string): Promise<void> {
    const chunkSize = 5000;
    let chunk: ExamResult[] = [];
    let totalInserted = 0;
    
    // Check if data already exists to prevent re-seeding
    const count = await this.examResultRepository.count();
    if (count > 0) {
      this.logger.log(`Database already seeded with ${count} records. Skip seeding.`);
      return;
    }
    
    this.logger.log(`Starting to seed from ${filePath}`);
    
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(csvParser());
      
      stream.on('data', async (data) => {
        const row = new ExamResult();
        row.registration_number = data.sbd;
        row.math = data.toan ? parseFloat(data.toan) : null;
        row.literature = data.ngu_van ? parseFloat(data.ngu_van) : null;
        row.foreign_language = data.ngoai_ngu ? parseFloat(data.ngoai_ngu) : null;
        row.physics = data.vat_li ? parseFloat(data.vat_li) : null;
        row.chemistry = data.hoa_hoc ? parseFloat(data.hoa_hoc) : null;
        row.biology = data.sinh_hoc ? parseFloat(data.sinh_hoc) : null;
        row.history = data.lich_su ? parseFloat(data.lich_su) : null;
        row.geography = data.dia_li ? parseFloat(data.dia_li) : null;
        row.civic_education = data.gdcd ? parseFloat(data.gdcd) : null;
        row.foreign_language_code = data.ma_ngoai_ngu || null;

        chunk.push(row);

        if (chunk.length >= chunkSize) {
          stream.pause();
          const itemsToInsert = chunk;
          chunk = [];
          this.examResultRepository.insert(itemsToInsert).then(() => {
            totalInserted += itemsToInsert.length;
            this.logger.log(`Inserted ${totalInserted} records so far...`);
            stream.resume();
          }).catch((err) => {
            this.logger.error('Error inserting chunk', err);
            stream.destroy(err);
          });
        }
      });

      stream.on('end', async () => {
        if (chunk.length > 0) {
          try {
            await this.examResultRepository.insert(chunk);
            totalInserted += chunk.length;
          } catch (err) {
            this.logger.error('Error inserting final chunk', err);
            return reject(err);
          }
        }
        this.logger.log(`Finished seeding. Total inserted: ${totalInserted}`);
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
