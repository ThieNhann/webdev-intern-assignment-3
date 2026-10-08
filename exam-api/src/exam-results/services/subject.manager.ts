export abstract class Subject {
  constructor(public readonly name: string) {}

  abstract getSelectQueries(): { query: string; alias: string }[];
}

export class StandardSubject extends Subject {
  getSelectQueries(): { query: string; alias: string }[] {
    return [
      {
        query: `SUM(CASE WHEN ${this.name} >= 8 THEN 1 ELSE 0 END)`,
        alias: `${this.name}_level_1`,
      },
      {
        query: `SUM(CASE WHEN ${this.name} >= 6 AND ${this.name} < 8 THEN 1 ELSE 0 END)`,
        alias: `${this.name}_level_2`,
      },
      {
        query: `SUM(CASE WHEN ${this.name} >= 4 AND ${this.name} < 6 THEN 1 ELSE 0 END)`,
        alias: `${this.name}_level_3`,
      },
      {
        query: `SUM(CASE WHEN ${this.name} < 4 THEN 1 ELSE 0 END)`,
        alias: `${this.name}_level_4`,
      },
    ];
  }
}

export class SubjectManager {
  private subjects: Subject[] = [];

  constructor() {
    const subjectNames = [
      'math',
      'literature',
      'foreign_language',
      'physics',
      'chemistry',
      'biology',
      'history',
      'geography',
      'civic_education',
    ];
    this.subjects = subjectNames.map((name) => new StandardSubject(name));
  }

  getAllSubjects(): Subject[] {
    return this.subjects;
  }
}
