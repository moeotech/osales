import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

export function Payments() {
  const { companyId } = useParams<{ companyId: string }>();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/payments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setPayments(res.payments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyId]);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Collections</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : payments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{pay.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(pay.date), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{pay.invoiceId.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">{Number(pay.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{pay.paymentMethod}</td>
                </tr>
              ))}
              {!loading && payments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
