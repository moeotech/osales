import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';

export function SaleReturns() {
  const { companyId } = useParams<{ companyId: string }>();
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/returns`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setReturns(res.returns || []);
      })
      .catch(console.error);
  }, [companyId]);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Returns</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          Returns module is structurally ready. Displaying {returns.length} returns.
        </div>
      </div>
    </div>
  );
}
