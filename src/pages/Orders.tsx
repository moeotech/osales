import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function Orders() {
  const { companyId } = useParams<{ companyId: string }>();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [companyId]);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/tenants/${companyId}/orders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setOrders(res.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  
  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch(`/api/tenants/${companyId}/orders/${orderId}/approve`, {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      });
      if (res.ok) fetchOrders();
      else alert('Failed to approve order');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const res = await fetch(`/api/tenants/${companyId}/invoices`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
         body: JSON.stringify({ orderId })
      });
      if (res.ok) {
         alert('Invoice generated successfully');
         // could redirect to invoices page
      } else {
         const err = await res.json();
         alert(err.error || 'Failed to generate invoice');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.orderNumber && o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Orders</h2>
          <p className="text-sm text-slate-500">Track all incoming field orders and their statuses.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchOrders} className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
             <RefreshCw className="h-4 w-4" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 flex items-center">
                      <ShoppingCart className="h-4 w-4 text-slate-400 mr-2" />
                      {order.orderNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {format(new Date(order.date), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {order.customerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {Number(order.total).toFixed(2)} JOD
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        order.status === 'Draft' ? 'bg-slate-100 text-slate-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {order.status !== 'Approved' && order.status !== 'Cancelled' && (
                           <button onClick={() => handleApprove(order.id)} className="text-blue-600 hover:text-blue-900 mr-3">Approve</button>
                        )}
                        {order.status === 'Approved' && (
                           <button onClick={() => handleGenerateInvoice(order.id)} className="text-emerald-600 hover:text-emerald-900 mr-3">Generate Invoice</button>
                        )}
                    </td>
                  </tr>
                ))}
                {!loading && filteredOrders.length === 0 && (
                   <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">No orders found.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
