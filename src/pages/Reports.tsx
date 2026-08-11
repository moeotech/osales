import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';

const REPORT_TYPES = [
  { id: 'visits', name: 'Visits' },
  { id: 'orders', name: 'Orders' },
  { id: 'collections', name: 'Collections' }
];

export function Reports() {
  const { companyId } = useParams<{ companyId: string }>();
  const [activeReport, setActiveReport] = useState('visits');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport, companyId]);

  const fetchReportData = (type: string) => {
    setLoading(true);
    let endpoint = '';
    if (type === 'visits') endpoint = `/api/tenants/${companyId}/visits`;
    else if (type === 'orders') endpoint = `/api/tenants/${companyId}/orders`;
    else if (type === 'collections') endpoint = `/api/tenants/${companyId}/payments`;

    if (!endpoint) return;

    fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        if (type === 'visits') setData(res.visits || []);
        else if (type === 'orders') setData(res.orders || []);
        else if (type === 'collections') setData(res.payments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{REPORT_TYPES.find(r => r.id === activeReport)?.name}</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600">{REPORT_TYPES.find(r => r.id === activeReport)?.name}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r bg-white p-4 overflow-y-auto">
          <div className="space-y-1">
            {REPORT_TYPES.map(report => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md ${activeReport === report.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {report.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
             {loading ? (
                <div className="p-8 text-center text-slate-500">Loading data...</div>
             ) : (
                <div className="overflow-x-auto">
                  {activeReport === 'visits' && (
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Rep</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Customer</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Duration (mins)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.map((row: any) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">{format(new Date(row.date), 'MMM d, yyyy h:mm a')}</td>
                            <td className="px-6 py-4">{row.repName}</td>
                            <td className="px-6 py-4">{row.customerName}</td>
                            <td className="px-6 py-4">{row.status}</td>
                            <td className="px-6 py-4">
                              {row.actualStart && row.actualEnd 
                                ? differenceInMinutes(new Date(row.actualEnd), new Date(row.actualStart)) 
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeReport === 'orders' && (
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Order ID</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Customer</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Total</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.map((row: any) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">{format(new Date(row.date), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4">{row.orderNumber}</td>
                            <td className="px-6 py-4">{row.customerName}</td>
                            <td className="px-6 py-4">{Number(row.total).toFixed(2)} JOD</td>
                            <td className="px-6 py-4">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {activeReport === 'collections' && (
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Amount</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-500">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.map((row: any) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">{format(new Date(row.date), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4">{Number(row.amount).toFixed(2)} JOD</td>
                            <td className="px-6 py-4">{row.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
