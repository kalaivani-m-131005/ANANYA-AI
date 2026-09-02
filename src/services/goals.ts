import api from './api';

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  category: string;
  targetDate?: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
}

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get('/goals');
  return response.data;
};

export const createGoal = async (data: Partial<Goal>): Promise<Goal> => {
  const response = await api.post('/goals', data);
  return response.data;
};

export const updateGoal = async (id: string, data: Partial<Goal>): Promise<Goal> => {
  const response = await api.put(`/goals/${id}`, data);
  return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};
