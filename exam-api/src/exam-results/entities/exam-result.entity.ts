import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('exam_results')
export class ExamResult {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  registration_number: string;

  @Column({ type: 'float', nullable: true })
  math: number | null;

  @Column({ type: 'float', nullable: true })
  literature: number | null;

  @Column({ type: 'float', nullable: true })
  foreign_language: number | null;

  @Column({ type: 'float', nullable: true })
  physics: number | null;

  @Column({ type: 'float', nullable: true })
  chemistry: number | null;

  @Column({ type: 'float', nullable: true })
  biology: number | null;

  @Column({ type: 'float', nullable: true })
  history: number | null;

  @Column({ type: 'float', nullable: true })
  geography: number | null;

  @Column({ type: 'float', nullable: true })
  civic_education: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  foreign_language_code: string | null;
}
