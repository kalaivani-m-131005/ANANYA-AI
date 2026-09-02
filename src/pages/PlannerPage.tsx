import { useEffect, useState, useMemo } from 'react';
import { Calendar, Plus, Pencil, Trash2, CheckCircle, Clock, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getStudySessions, createStudySession, updateStudySession, deleteStudySession, type StudySession } from '@/services/studySessions';
import { getGoals, type Goal } from '@/services/goals';
import { getTasks, type Task } from '@/services/tasks';
import { Spinner } from '@/components/ui/Spinner';

export default function PlannerPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<StudySession> | null>(null);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, goalsData, tasksData] = await Promise.all([
        getStudySessions(),
        getGoals(),
        getTasks()
      ]);
      setSessions(sessionsData);
      setGoals(goalsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch planner data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession?.subject || !currentSession?.topic || !currentSession?.date || !currentSession?.durationMinutes) return;

    try {
      if (currentSession._id) {
        await updateStudySession(currentSession._id, currentSession);
      } else {
        await createStudySession(currentSession);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save study session', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this study session?')) return;
    try {
      await deleteStudySession(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete study session', error);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await updateStudySession(id, { status: 'Completed' });
      fetchData();
    } catch (error) {
      console.error('Failed to complete study session', error);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.subject.toLowerCase().includes(search.toLowerCase()) || 
                            session.topic.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || session.type === filterType;
      const matchesStatus = filterStatus === 'All' || session.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sessions, search, filterType, filterStatus]);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => new Date(s.date).toISOString().split('T')[0] === today);
  const plannedSessions = sessions.filter(s => s.status === 'Planned');
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size={10} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-indigo-500" />
            Smart Study Planner
          </h1>
          <p className="mt-2 text-slate-600">Plan your study sessions and stay consistent with your academic goals.</p>
        </div>
        <button
          onClick={() => { 
            setCurrentSession({ 
              type: 'Study', 
              priority: 'Medium', 
              status: 'Planned', 
              date: new Date().toISOString().split('T')[0],
              durationMinutes: 60
            }); 
            setIsModalOpen(true); 
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Study Session
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-slate-500 text-sm font-medium mb-1">Today's Sessions</span>
            <span className="text-2xl font-bold text-indigo-700">{todaySessions.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-slate-500 text-sm font-medium mb-1">Completed</span>
            <span className="text-2xl font-bold text-emerald-700">{completedSessions.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-slate-500 text-sm font-medium mb-1">Planned</span>
            <span className="text-2xl font-bold text-amber-700">{plannedSessions.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-slate-500 text-sm font-medium mb-1">Total Minutes</span>
            <span className="text-2xl font-bold text-blue-700">{totalMinutes}</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subject or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="Study">Study</option>
            <option value="Revision">Revision</option>
            <option value="Practice">Practice</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam Preparation">Exam Preparation</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No sessions found</h3>
            <p className="text-slate-500 text-sm">Adjust your filters or add a new study session.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <Card key={session._id} className="relative group overflow-hidden flex flex-col">
              <div className={`h-1.5 w-full ${
                session.status === 'Completed' ? 'bg-emerald-500' : 
                session.status === 'In Progress' ? 'bg-amber-500' : 'bg-indigo-500'
              }`} />
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    session.type === 'Exam Preparation' ? 'bg-red-100 text-red-700' :
                    session.type === 'Assignment' ? 'bg-purple-100 text-purple-700' :
                    session.type === 'Revision' ? 'bg-amber-100 text-amber-700' :
                    session.type === 'Practice' ? 'bg-blue-100 text-blue-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {session.type}
                  </span>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {session.status !== 'Completed' && (
                      <button onClick={() => markCompleted(session._id)} className="p-1 text-slate-400 hover:text-emerald-600 rounded">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => { setCurrentSession(session); setIsModalOpen(true); }} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteSession(session._id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{session.subject}</h3>
                <p className="text-sm text-slate-600 mb-4">{session.topic}</p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-xs text-slate-500 gap-2">
                    <Calendar className="h-3.5 w-3.5" /> 
                    {new Date(session.date).toLocaleDateString()}
                    {session.startTime && ` • ${session.startTime}`}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 gap-2">
                    <Clock className="h-3.5 w-3.5" /> 
                    {session.durationMinutes} mins
                  </div>
                  
                  {(session.goalId || session.taskId) && (
                    <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      {session.goalId && goals.find(g => g._id === session.goalId) && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Goal: {goals.find(g => g._id === session.goalId)?.title}
                        </span>
                      )}
                      {session.taskId && tasks.find(t => t._id === session.taskId) && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Task: {tasks.find(t => t._id === session.taskId)?.title}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-slate-900">{currentSession?._id ? 'Edit Study Session' : 'Add Study Session'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSaveSession} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={currentSession?.subject || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Topic *</label>
                  <input
                    type="text"
                    required
                    value={currentSession?.topic || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Linear Algebra Matrices"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={currentSession?.date ? new Date(currentSession.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={currentSession?.startTime || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={currentSession?.durationMinutes || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, durationMinutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                  <select
                    value={currentSession?.type || 'Study'}
                    onChange={(e) => setCurrentSession({ ...currentSession, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Revision">Revision</option>
                    <option value="Practice">Practice</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam Preparation">Exam Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={currentSession?.priority || 'Medium'}
                    onChange={(e) => setCurrentSession({ ...currentSession, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={currentSession?.status || 'Planned'}
                    onChange={(e) => setCurrentSession({ ...currentSession, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link to Goal (Optional)</label>
                  <select
                    value={currentSession?.goalId || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, goalId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">None</option>
                    {goals.map(goal => (
                      <option key={goal._id} value={goal._id}>{goal.title}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link to Task (Optional)</label>
                  <select
                    value={currentSession?.taskId || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, taskId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">None</option>
                    {tasks.map(task => (
                      <option key={task._id} value={task._id}>{task.title}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={currentSession?.notes || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">
                  {currentSession?._id ? 'Update Session' : 'Save Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
