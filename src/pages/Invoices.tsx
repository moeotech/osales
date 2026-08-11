import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function Invoices() {
  const { companyId } = useParams<{ companyId: string }>();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = () => {
    setLoading(true);
    fetch(`/api/tenants/${companyId}/invoices`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setInvoices(res.invoices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, [companyId]);

  const handlePay = async (invoiceId: string, remaining: number) => {
    const amount = prompt('Enter payment amount:', remaining.toString());
    if (!amount) return;
    
    try {
      const res = await fetch(`/api/tenants/${companyId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({
          invoiceId,
          amount: Number(amount),
          paymentMethod: 'Bank Transfer'
        })
      });
      if (res.ok) {
        alert('Payment recorded');
        fetchInvoices();
      } else {
        const err = await res.json();
        alert(err.error || 'Payment failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(inv.date), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{Number(inv.grandTotal).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{Number(inv.remaining).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {inv.status !== 'Paid' && (
                      <button onClick={() => handlePay(inv.id, inv.remaining)} className="text-blue-600 hover:text-blue-900 font-medium">Record Payment</button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && invoices.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-4 text-center">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
