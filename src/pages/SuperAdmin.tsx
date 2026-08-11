import React, { useState, useEffect } from 'react';
import { Building, Plus, ArrowRight, Activity, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SuperAdmin() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/tenants', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setCompanies(res.tenants || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAddCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementation for adding a company is out of scope for now
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">SaaS Tenants (Companies)</h2>
          <p className="text-sm text-slate-500">Manage companies using the OSales platform.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Company
        </button>
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Loading tenants...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md cursor-pointer group"
              onClick={() => navigate(`/company/${company.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                      <p className="text-xs text-slate-500">ID: {company.id.substring(0,8)}...</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    company.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                    'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20'
                  }`}>
                    {company.status}
                  </span>
                </div>
                
                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-end">
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Enter Dashboard
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
