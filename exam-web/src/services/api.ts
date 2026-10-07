import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});


export interface ScoreData {
  registration_number: string;
  math: number | null;
  literature: number | null;
  physics: number | null;
  chemistry: number | null;
  biology: number | null;
  history: number | null;
  geography: number | null;
  civic_education: number | null;
  foreign_language: number | null;
  foreign_language_code: string | null;
}

export interface StatisticsData {
  [subject: string]: {
    '>=8': number;
    '6-8': number;
    '4-6': number;
    '<4': number;
  };
}

export interface TopGroupAData {
  registration_number: string;
  math: number;
  physics: number;
  chemistry: number;
  total: number;
}

export const apiService = {
  getScoresByRegistrationNumber: async (registrationNumber: string): Promise<ScoreData> => {
    const response = await apiClient.get(`/scores/${registrationNumber}`);
    return response.data;
  },

  getStatistics: async (): Promise<StatisticsData> => {
    const response = await apiClient.get('/reports/statistics');
    return response.data;
  },

  getTopGroupA: async (): Promise<TopGroupAData[]> => {
    const response = await apiClient.get('/reports/top-group-a');
    return response.data;
  },
};
