import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { type StatisticsData } from '../services/api';

interface StatChartProps {
  data: StatisticsData | null;
}

export const StatChart: React.FC<StatChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Map backend keys to nice labels
    const subjectMap: Record<string, string> = {
      math: 'Math',
      literature: 'Literature',
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      history: 'History',
      geography: 'Geography',
      civic_education: 'Civic Edu',
      foreign_language: 'Foreign Lang',
    };

    return Object.entries(data).map(([subject, counts]) => ({
      name: subjectMap[subject] || subject,
      '>=8': Number(counts['>=8']),
      '6-8': Number(counts['6-8']),
      '4-6': Number(counts['4-6']),
      '<4': Number(counts['<4']),
    }));
  }, [data]);

  if (!data) return null;

  return (
    <div className="card animate-fade-in" style={{ height: '500px' }}>
      <div className="card-header">
        <h3 className="card-title">Score Distribution by Subject</h3>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Bar dataKey=">=8" name="Score >= 8" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="6-8" name="6 <= Score < 8" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="4-6" name="4 <= Score < 6" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="<4" name="Score < 4" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
