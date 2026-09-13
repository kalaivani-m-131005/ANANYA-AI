import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Bookmark, BookmarkCheck, ExternalLink, Sparkles, AlertCircle, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { getResources, getRecommendedResources, toggleSaveResource, type Resource, type RecommendedResource } from '@/services/resources';
import { Badge } from '@/components/ui/Badge';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recsError, setRecsError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const loadResources = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getResources({ search, subject, type, difficulty });
      setResources(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [search, subject, type, difficulty]); // Debounce would be better in prod

  const generateRecommendations = async () => {
    try {
      setRecsLoading(true);
      setRecsError('');
      const data = await getRecommendedResources();
      setRecommendations(data);
    } catch (err: any) {
      setRecsError(err.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setRecsLoading(false);
    }
  };

  const handleToggleSave = async (id: string) => {
    try {
      const { isSaved } = await toggleSaveResource(id);
      setResources(resources.map(r => r._id === id ? { ...r, isSaved } : r));
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Article': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Course': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Documentation': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Practice': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary-500" />
            Learning Resources
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Discover curated study materials and AI-recommended content.
          </p>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 dark:border-indigo-900/30">
        <CardHeader className="pb-3 border-b border-indigo-100/50 dark:border-indigo-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2.5 dark:bg-indigo-900/50">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">AI Personalised Resources</CardTitle>
                <p className="text-sm text-indigo-600/80 dark:text-indigo-300/80">Tailored to your career goals and current tasks</p>
              </div>
            </div>
            <Button onClick={generateRecommendations} disabled={recsLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
              {recsLoading ? <Spinner size={4} className="mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {recommendations.length > 0 ? 'Refresh Suggestions' : 'Generate Suggestions'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {recsError && (
            <div className="mb-4 p-4 rounded-md bg-red-50 text-red-600 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{recsError}</p>
            </div>
          )}
          
          {recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, i) => (
                <a key={i} href={rec.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="h-full p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${getTypeColor(rec.resourceType)}`}>
                        {rec.resourceType}
                      </span>
                      {rec.difficulty && (
                        <span className="text-xs font-medium text-slate-500">{rec.difficulty}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-2 line-clamp-2">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 gap-2">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span>{rec.provider}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : !recsLoading && !recsError && (
            <div className="text-center py-6">
              <p className="text-indigo-600/80 dark:text-indigo-300/80">
                Click "Generate Suggestions" to get AI-curated learning materials based on your academic profile.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Library */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Resource Library</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search resources..." 
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <select 
              className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Engineering">Engineering</option>
            </select>
            <select 
              className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Video">Video</option>
              <option value="Article">Article</option>
              <option value="Course">Course</option>
              <option value="Documentation">Documentation</option>
              <option value="Practice">Practice</option>
              <option value="Book">Book</option>
            </select>
            <select 
              className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="">Any Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size={8} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={loadResources}>Try Again</Button>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Filter className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-slate-500 max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
            {(search || subject || type || difficulty) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearch(''); setSubject(''); setType(''); setDifficulty(''); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource._id} className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getTypeColor(resource.resourceType)} variant="default">
                      {resource.resourceType}
                    </Badge>
                    <button 
                      onClick={() => handleToggleSave(resource._id)}
                      className="text-slate-400 hover:text-primary-600 transition-colors"
                      title={resource.isSaved ? "Unsave" : "Save resource"}
                    >
                      {resource.isSaved ? (
                        <BookmarkCheck className="h-5 w-5 text-primary-600 fill-primary-600/20" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2" title={resource.title}>
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {resource.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                    {resource.difficulty && (
                      <span className="text-xs border border-slate-200 dark:border-slate-700 text-slate-500 px-2 py-1 rounded-md">
                        {resource.difficulty}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <div className="flex items-center justify-between w-full pt-4">
                    <span className="text-xs text-slate-500">{resource.provider}</span>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Open
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
