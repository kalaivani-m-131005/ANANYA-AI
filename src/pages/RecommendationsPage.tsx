/* ============================================================
   ANANYA-AI — Recommendations Page
   ============================================================ */

import { useEffect, useState } from 'react';
import { Lightbulb, RefreshCw, AlertCircle, TrendingUp, Target, BrainCircuit, Clock, Briefcase } from 'lucide-react';
import { getRecommendations, type Recommendation } from '@/services/ai';
import { Spinner } from '@/components/ui/Spinner';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecs = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setGenerating(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await getRecommendations(forceRefresh);
      setRecommendations(data);
    } catch (err: any) {
      console.error('Failed to load recommendations', err);
      setError(err.response?.data?.message || 'Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecs(false);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('study')) return <TrendingUp className="w-5 h-5" />;
    if (c.includes('goal')) return <Target className="w-5 h-5" />;
    if (c.includes('skill')) return <BrainCircuit className="w-5 h-5" />;
    if (c.includes('time')) return <Clock className="w-5 h-5" />;
    if (c.includes('career')) return <Briefcase className="w-5 h-5" />;
    return <Lightbulb className="w-5 h-5" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Recommendations</h1>
          <p className="text-slate-500 mt-1">Personalized, actionable guidance based on your academic data.</p>
        </div>
        <button
          onClick={() => fetchRecs(true)}
          disabled={loading || generating}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 font-medium shadow-sm"
        >
          {generating ? <Spinner size={4} /> : <RefreshCw className="w-4 h-4" />}
          {generating ? 'Analyzing Profile...' : 'Refresh AI Analysis'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && !generating ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size={8} />
        </div>
      ) : recommendations.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Recommendations Yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            We need a bit more data about your academic journey. Try adding some goals, tasks, or study sessions first.
          </p>
          <button
            onClick={() => fetchRecs(true)}
            disabled={generating}
            className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {generating ? <Spinner size={4} /> : 'Generate Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-sm font-medium border border-indigo-100">
                    {getCategoryIcon(rec.category)}
                    {rec.category}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{rec.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{rec.explanation}</p>
                
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Why this matters</span>
                  <p className="text-sm text-slate-700 italic">{rec.reason}</p>
                </div>
              </div>
              
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1 block">Actionable Step</span>
                <p className="text-sm font-medium text-slate-800">{rec.actionableStep}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
