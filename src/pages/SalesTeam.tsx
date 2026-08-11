import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, RefreshCw, Upload, Users } from 'lucide-react';

export function SalesTeam() {
  const { companyId } = useParams<{ companyId: string }>();
  const [reps, setReps] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [companyId]);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/tenants/${companyId}/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setReps(res.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredReps = reps.filter(r => 
    (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Team</h2>
          <p className="text-sm text-slate-500">Manage your sales representatives and their territories.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchUsers} className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
             <RefreshCw className="h-4 w-4" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search team..." 
              className="pl-9 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm">
            Add Representative
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Representative</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Territory</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredReps.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-slate-900">{rep.name}</div>
                          <div className="text-slate-500">{rep.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">{rep.role.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-slate-500">{rep.territory || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        rep.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && filteredReps.length === 0 && (
                   <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No representatives found.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
