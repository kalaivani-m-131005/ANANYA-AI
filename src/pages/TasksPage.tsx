import { useEffect, useState } from 'react';
import { CheckSquare, Plus, Pencil, Trash2, CheckCircle, Circle, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getTasks, createTask, updateTask, deleteTask, type Task } from '@/services/tasks';
import { getGoals, type Goal } from '@/services/goals';
import { Spinner } from '@/components/ui/Spinner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksData, goalsData] = await Promise.all([getTasks(), getGoals()]);
      setTasks(tasksData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask?.title) return;

    try {
      if (currentTask._id) {
        await updateTask(currentTask._id, currentTask);
      } else {
        await createTask(currentTask);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task._id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size={10} /></div>;
  }

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-blue-500" />
            My Tasks
          </h1>
          <p className="mt-2 text-slate-600">Manage your daily study tasks and assignments.</p>
        </div>
        <button
          onClick={() => { setCurrentTask({ priority: 'medium', status: 'pending' }); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" /> Pending ({pendingTasks.length})
          </h2>
          {pendingTasks.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No pending tasks. Great job!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <Card key={task._id} className="group hover:border-indigo-300 transition-colors">
                  <CardContent className="p-4 flex gap-4">
                    <button onClick={() => toggleTaskStatus(task)} className="mt-1 flex-shrink-0 text-slate-300 hover:text-emerald-500 transition-colors">
                      <Circle className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setCurrentTask(task); setIsModalOpen(true); }} className="text-slate-400 hover:text-indigo-600">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteTask(task._id)} className="text-slate-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" /> Completed ({completedTasks.length})
          </h2>
          {completedTasks.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500">
              Complete tasks to see them here.
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks.map(task => (
                <Card key={task._id} className="opacity-75">
                  <CardContent className="p-4 flex gap-4">
                    <button onClick={() => toggleTaskStatus(task)} className="mt-1 flex-shrink-0 text-emerald-500 hover:text-slate-400 transition-colors">
                      <CheckCircle className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-slate-600 line-through">{task.title}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteTask(task._id)} className="text-slate-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{currentTask?._id ? 'Edit Task' : 'Create Task'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentTask?.title || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={currentTask?.description || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={currentTask?.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={currentTask?.priority || 'medium'}
                    onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Associate Goal (Optional)</label>
                <select
                  value={currentTask?.goalId || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, goalId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">None</option>
                  {goals.map(goal => (
                    <option key={goal._id} value={goal._id}>{goal.title}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">
                  {currentTask?._id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
