import api from './api';

export interface AnalyticsData {
  study: {
    totalStudyMinutes: number;
    totalStudyHours: number;
    totalSessions: number;
    completedSessions: number;
    plannedSessions: number;
    averageSessionDuration: number;
  };
  goals: {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    averageGoalProgress: number;
    goalCompletionRate: number;
  };
  tasks: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    taskCompletionRate: number;
  };
  charts: {
    subjectData: { name: string; value: number }[];
    recentActivityData: { date: string; hours: number }[];
  };
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getAIInsights = async (): Promise<string[]> => {
  const response = await api.get('/analytics/ai-insights');
  return response.data;
};
