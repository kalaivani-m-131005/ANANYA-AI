import api from './api';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  resourceType: 'Video' | 'Article' | 'Documentation' | 'Course' | 'Practice' | 'Book';
  subject: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  provider: string;
  tags: string[];
  isSaved?: boolean;
}

export interface RecommendedResource {
  title: string;
  description: string;
  url: string;
  resourceType: string;
  difficulty: string;
  provider: string;
  tags: string[];
}

export interface GetResourcesParams {
  search?: string;
  subject?: string;
  topic?: string;
  type?: string;
  difficulty?: string;
}

export const getResources = async (params?: GetResourcesParams): Promise<Resource[]> => {
  const { data } = await api.get('/resources', { params });
  return data;
};

export const getResourceById = async (id: string): Promise<Resource> => {
  const { data } = await api.get(`/resources/${id}`);
  return data;
};

export const toggleSaveResource = async (id: string): Promise<{ isSaved: boolean }> => {
  const { data } = await api.post(`/resources/${id}/save`);
  return data;
};

export const getRecommendedResources = async (): Promise<RecommendedResource[]> => {
  const { data } = await api.get('/resources/recommendations');
  return data;
};
