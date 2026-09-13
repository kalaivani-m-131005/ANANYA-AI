import api from './api';

export interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/ai/conversations');
  return response.data;
};

export const getConversation = async (id: string): Promise<Conversation> => {
  const response = await api.get(`/ai/conversations/${id}`);
  return response.data;
};

export const deleteConversation = async (id: string): Promise<void> => {
  await api.delete(`/ai/conversations/${id}`);
};

export const sendChatMessage = async (message: string, conversationId?: string): Promise<{ conversationId: string; reply: string }> => {
  const response = await api.post('/ai/chat', { message, conversationId });
  return response.data;
};

export interface Recommendation {
  _id?: string;
  title: string;
  explanation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  actionableStep: string;
  relatedEntity?: {
    type: 'Goal' | 'Task' | 'Subject' | null;
    id: string;
  };
}

export const getRecommendations = async (forceRefresh: boolean = false): Promise<Recommendation[]> => {
  const response = await api.get(`/ai/recommendations?forceRefresh=${forceRefresh}`);
  return response.data;
};
