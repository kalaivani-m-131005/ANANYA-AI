import { useEffect, useState } from 'react';
import { Target, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getGoals, createGoal, updateGoal, deleteGoal, type Goal } from '@/services/goals';
import { Spinner } from '@/components/ui/Spinner';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Partial<Goal> | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal?.title) return;

    try {
      if (currentGoal._id) {
        await updateGoal(currentGoal._id, currentGoal);
      } else {
        await createGoal(currentGoal);
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (error) {
      console.error('Failed to save goal', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal', error);
    }
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      const status = progress === 100 ? 'completed' : 'in_progress';
      await updateGoal(id, { progress, status });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update progress', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size={10} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-emerald-500" />
            My Goals
          </h1>
          <p className="mt-2 text-slate-600">Track and achieve your academic objectives.</p>
        </div>
        <button
          onClick={() => { setCurrentGoal({ progress: 0, status: 'not_started' }); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No goals yet</h3>
            <p className="text-slate-500 text-sm mb-4">Set your first goal to get started.</p>
            <button
              onClick={() => { setCurrentGoal({ progress: 0, status: 'not_started' }); setIsModalOpen(true); }}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Goal
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <Card key={goal._id} className="relative group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      goal.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {goal.status === 'completed' ? 'Completed' : goal.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 truncate">{goal.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{goal.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentGoal(goal); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal._id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-indigo-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleUpdateProgress(goal._id, parseInt(e.target.value))}
                    className="w-full mt-3 cursor-pointer"
                  />
                  {goal.targetDate && (
                    <div className="mt-4 text-xs text-slate-500">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{currentGoal?._id ? 'Edit Goal' : 'Create Goal'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSaveGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentGoal?.title || ''}
                  onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={currentGoal?.description || ''}
                  onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={currentGoal?.category || ''}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={currentGoal?.targetDate ? new Date(currentGoal.targetDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">
                  {currentGoal?._id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
