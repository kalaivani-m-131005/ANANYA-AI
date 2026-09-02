/* ============================================================
   ANANYA-AI — Dashboard Page
   ============================================================ */

import { useEffect, useState } from 'react';
import { LayoutDashboard, Target, CheckSquare, Calendar, BarChart3, UserCircle, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getProfile } from '@/services/profile';
import { getGoals, type Goal } from '@/services/goals';
import { getTasks, type Task } from '@/services/tasks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profile, goalsData, tasksData] = await Promise.all([
          getProfile(),
          getGoals(),
          getTasks()
        ]);
        setProfileData(profile);
        setGoals(goalsData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    const fields = ['name', 'department', 'college', 'year', 'skills', 'careerGoal'];
    const completed = fields.filter(field => {
      if (Array.isArray(profileData[field])) {
        return profileData[field].length > 0;
      }
      return !!profileData[field];
    }).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={10} />
      </div>
    );
  }

  const completion = calculateProfileCompletion();
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p className="mt-2 text-slate-600">
          Here's an overview of your academic journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCircle className="h-5 w-5 text-indigo-500" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">College:</span> {profileData?.college || 'Not set'}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Dept/Year:</span> {profileData?.department || 'Not set'} - {profileData?.year || 'Not set'}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Goal:</span> {profileData?.careerGoal || 'Not set'}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Profile Completion</span>
                <span className="text-sm font-bold text-indigo-600">{completion}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${completion}%` }}></div>
              </div>
              {completion < 100 && (
                <p className="text-xs text-slate-500 mt-2">
                  Complete your profile for better AI recommendations.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-emerald-500" />
                Goals
              </CardTitle>
              <Link to="/goals" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Target className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm">No goals added yet.</p>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 text-sm">Total Goals</span>
                    <span className="font-semibold text-slate-900">{goals.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 text-sm">Completed</span>
                    <span className="font-semibold text-emerald-600">{completedGoals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">In Progress</span>
                    <span className="font-semibold text-blue-600">{inProgressGoals}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-blue-500" />
                Tasks
              </CardTitle>
              <Link to="/tasks" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckSquare className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm">No tasks available yet.</p>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 text-sm">Total Tasks</span>
                    <span className="font-semibold text-slate-900">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 text-sm">Completed</span>
                    <span className="font-semibold text-emerald-600">{completedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Pending</span>
                    <span className="font-semibold text-amber-600">{pendingTasks}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-amber-500" />
                Study Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm">Create your first study plan.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <BarChart3 className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm">Analytics will appear as you use ANANYA-AI.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
