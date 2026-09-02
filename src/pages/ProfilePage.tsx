/* ============================================================
   ANANYA-AI — Profile Page (Phase 2 Stub)
   Full implementation in Phase 4.
   ============================================================ */

import { useState, useEffect } from 'react';
import { User as UserIcon, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, updateProfile } from '@/services/profile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    college: '',
    year: '',
    skills: '',
    careerGoal: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          name: data.name || '',
          department: data.department || '',
          college: data.college || '',
          year: data.year || '',
          skills: data.skills?.join(', ') || '',
          careerGoal: data.careerGoal || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      const response = await updateProfile(updatedData);
      updateUser(response);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={10} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <UserIcon className="h-8 w-8 text-primary" />
          Student Profile
        </h1>
        <p className="mt-2 text-slate-600">
          Manage your academic profile, skills, and career goals.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your basic details and academic status.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-md flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500">Email cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">College / University</label>
                <Input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="E.g. XYZ Institute of Technology"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="E.g. Computer Science"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Year of Study</label>
                <Input
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="E.g. 3rd Year"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Career Goal</label>
                <Input
                  name="careerGoal"
                  value={formData.careerGoal}
                  onChange={handleChange}
                  placeholder="E.g. Software Engineer"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">Skills (comma separated)</label>
                <Input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, Machine Learning"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 border-t border-slate-200 px-6 py-4">
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Spinner size={4} className="mr-2 text-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
