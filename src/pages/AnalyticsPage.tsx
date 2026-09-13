import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Brain, 
  Clock, 
  Target, 
  CheckCircle2, 
  BookOpen,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getAnalytics, getAIInsights, type AnalyticsData } from '@/services/analytics';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const analyticsData = await getAnalytics();
      setData(analyticsData);
      
      // Load AI Insights in parallel but track loading separately
      setInsightsLoading(true);
      getAIInsights()
        .then(res => setInsights(res))
        .catch(err => console.error('Failed to load insights:', err))
        .finally(() => setInsightsLoading(false));

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size={8} className="text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Failed to load analytics</h2>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
        <Button onClick={loadData}>Try Again</Button>
      </div>
    );
  }

  if (!data) return null;

  const hasData = data.study.totalSessions > 0 || data.tasks.totalTasks > 0 || data.goals.totalGoals > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center">
        <div className="rounded-full bg-primary-100 p-6 dark:bg-primary-900/20">
          <BarChart3 className="h-16 w-16 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Analytics Data Yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Start adding tasks, setting goals, and completing study sessions to see your performance analytics here.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/app'}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Analytics
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Insights and trends based on your academic activity.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading || insightsLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${(loading || insightsLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/50 dark:to-slate-900 border-indigo-100 dark:border-indigo-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Study Time</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{data.study.totalStudyHours}h</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/50 dark:to-slate-900 border-emerald-100 dark:border-emerald-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Task Completion</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{data.tasks.taskCompletionRate}%</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {data.tasks.completedTasks} / {data.tasks.totalTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/50 dark:to-slate-900 border-amber-100 dark:border-amber-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Goal Progress</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{data.goals.averageGoalProgress}%</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 font-medium">
              {data.goals.completedGoals} goals achieved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900 border-blue-100 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Study Sessions</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{data.study.completedSessions}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
              {data.study.averageSessionDuration} min avg duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="border-primary-100 bg-primary-50/50 dark:border-primary-900/50 dark:bg-primary-900/10 shadow-sm">
        <CardHeader className="pb-3 border-b border-primary-100/50 dark:border-primary-900/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-100 p-2.5 dark:bg-primary-900/50">
              <Brain className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Academic Insights</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personalized observations from Gemini</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {insightsLoading ? (
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <Spinner size={4} />
              <p>Analyzing your academic performance...</p>
            </div>
          ) : insights.length > 0 ? (
            <ul className="space-y-3">
              {insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">No insights available right now.</p>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Study Activity (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.charts.recentActivityData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.recentActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return `${d.getDate()}/${d.getMonth()+1}`;
                      }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar 
                      dataKey="hours" 
                      name="Hours" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-slate-500">
                No recent study activity to display.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Study Time by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            {data.charts.subjectData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.subjectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.charts.subjectData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value} hours`, 'Time']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-slate-500">
                No subject data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
