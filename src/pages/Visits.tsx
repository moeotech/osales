import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';

export function Visits() {
  const { companyId } = useParams<{ companyId: string }>();
  const [visits, setVisits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, [companyId]);

  const fetchVisits = () => {
    setLoading(true);
    fetch(`/api/tenants/${companyId}/visits`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setVisits(res.visits || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredVisits = visits.filter(v => 
    (v.customerName && v.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.repName && v.repName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.id && v.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visits</h2>
          <p className="text-sm text-slate-500">Track all field visits.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchVisits} className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
             <RefreshCw className="h-4 w-4" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search visits..." 
              className="pl-9 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Start</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">End</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Rep</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">{visit.id.substring(0, 8)}</td>
                    <td className="px-4 py-4 text-slate-600">{format(new Date(visit.date), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-4 text-slate-600">{visit.actualStart ? format(new Date(visit.actualStart), 'h:mm a') : 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-600">{visit.actualEnd ? format(new Date(visit.actualEnd), 'h:mm a') : 'N/A'}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{visit.repName}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{visit.customerName}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        visit.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        visit.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {visit.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{visit.outcome || '-'}</td>
                  </tr>
                ))}
                {!loading && filteredVisits.length === 0 && (
                   <tr><td colSpan={8} className="px-6 py-4 text-center text-sm text-slate-500">No visits found.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
