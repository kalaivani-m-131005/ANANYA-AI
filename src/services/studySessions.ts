import api from './api';

export interface StudySession {
  _id: string;
  subject: string;
  topic: string;
  date: string;
  startTime?: string;
  durationMinutes: number;
  type: 'Study' | 'Revision' | 'Practice' | 'Assignment' | 'Exam Preparation';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Planned' | 'In Progress' | 'Completed';
  notes?: string;
  goalId?: string;
  taskId?: string;
  createdAt: string;
}

export const getStudySessions = async (): Promise<StudySession[]> => {
  const response = await api.get('/study-sessions');
  return response.data;
};

export const createStudySession = async (data: Partial<StudySession>): Promise<StudySession> => {
  const response = await api.post('/study-sessions', data);
  return response.data;
};

export const updateStudySession = async (id: string, data: Partial<StudySession>): Promise<StudySession> => {
  const response = await api.put(`/study-sessions/${id}`, data);
  return response.data;
};

export const deleteStudySession = async (id: string): Promise<void> => {
  await api.delete(`/study-sessions/${id}`);
};

export const getStudySession = async (id: string): Promise<StudySession> => {
  const response = await api.get(`/study-sessions/${id}`);
  return response.data;
};
