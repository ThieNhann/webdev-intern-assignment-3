import React, { useState } from 'react';
import { apiService, type ScoreData } from '../services/api';
import { Search } from 'lucide-react';

interface SearchCardProps {
  onSearchResult: (result: ScoreData | null, error: string | null) => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({ onSearchResult }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!registrationNumber.trim()) {
      setError('Registration number cannot be empty');
      return;
    }

    if (!/^\d+$/.test(registrationNumber)) {
      setError('Registration number must contain only digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await apiService.getScoresByRegistrationNumber(registrationNumber);
      onSearchResult(data, null);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        onSearchResult(null, 'No student found with this registration number.');
      } else {
        onSearchResult(null, 'Network error or server error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">User Registration</h3>
      </div>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <label className="input-label" htmlFor="regNumber">Registration Number</label>
          <input
            id="regNumber"
            type="text"
            className="input-field"
            placeholder="Enter student registration number (e.g., 26020938)"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
          {error && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : (
            <>
              <Search size={16} style={{ marginRight: '0.5rem' }} />
              Search Scores
            </>
          )}
        </button>
      </form>
    </div>
  );
};

interface ScoreTableProps {
  scoreData: ScoreData | null;
  error: string | null;
}

export const ScoreTable: React.FC<ScoreTableProps> = ({ scoreData, error }) => {
  if (error) {
    return (
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Detailed Scores</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--error-color)' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Detailed Scores</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
          <p>Please search for a registration number to view detailed scores.</p>
        </div>
      </div>
    );
  }

  const subjects = [
    { key: 'math', label: 'Math' },
    { key: 'literature', label: 'Literature' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
    { key: 'history', label: 'History' },
    { key: 'geography', label: 'Geography' },
    { key: 'civic_education', label: 'Civic Education' },
    { key: 'foreign_language', label: 'Foreign Language' },
  ];

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">Detailed Scores - #{scoreData.registration_number}</h3>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => {
              const score = (scoreData as any)[sub.key];
              return (
                <tr key={sub.key}>
                  <td>
                    {sub.label}
                    {sub.key === 'foreign_language' && scoreData.foreign_language_code ? ` (${scoreData.foreign_language_code})` : ''}
                  </td>
                  <td>
                    {score !== null && score !== undefined ? (
                      <strong style={{ color: 'var(--primary-color)' }}>{score}</strong>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
