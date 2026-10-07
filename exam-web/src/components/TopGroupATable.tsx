import React from 'react';
import { type TopGroupAData } from '../services/api';

interface TopGroupATableProps {
  data: TopGroupAData[] | null;
}

export const TopGroupATable: React.FC<TopGroupATableProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">Top 10 Students - Group A</h3>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Registration No.</th>
              <th>Math</th>
              <th>Physics</th>
              <th>Chemistry</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => (
              <tr key={student.registration_number}>
                <td>
                  <span style={{ 
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    lineHeight: '24px',
                    textAlign: 'center',
                    backgroundColor: index < 3 ? 'var(--warning-color)' : 'var(--bg-color)',
                    color: index < 3 ? 'white' : 'inherit',
                    borderRadius: '50%',
                    fontWeight: index < 3 ? 'bold' : 'normal'
                  }}>
                    {index + 1}
                  </span>
                </td>
                <td style={{ fontWeight: '500' }}>{student.registration_number}</td>
                <td>{student.math}</td>
                <td>{student.physics}</td>
                <td>{student.chemistry}</td>
                <td>
                  <strong style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                    {student.total}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
