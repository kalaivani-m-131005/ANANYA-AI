import api from './api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  goalId?: string;
  completedAt?: string;
  createdAt: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
