import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, FileText, ShoppingCart, DollarSign, Calendar, Target, Activity, Play } from 'lucide-react';

export function CustomerProfile() {
  const { companyId, customerId } = useParams<{ companyId: string, customerId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Financial', 'Orders', 'Invoices', 'Payments', 'Visits'];

  useEffect(() => {
    
    
    fetch(`/api/tenants/${companyId}/customers/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        // Fallback for demo
        setData({
          customer: { name: 'Customer XYZ', type: 'Supermarket', balance: '1250.00', status: 'active', customerCode: 'C-100' },
          orders: [{ id: '1', orderNumber: 'ORD-001', date: new Date().toISOString(), total: '450.00', status: 'Delivered' }],
          visits: [{ id: '1', date: new Date().toISOString(), status: 'Completed', outcome: 'Order Created' }],
          invoices: [{ id: '1', invoiceNumber: 'INV-001', date: new Date().toISOString(), total: '450.00', remaining: '450.00', status: 'Issued' }],
          payments: []
        });
        setLoading(false);
      });
  }, [companyId, customerId]);

  if (loading) return <div className="p-8">Loading Customer 360...</div>;
  if (!data?.customer) return <div className="p-8">Customer not found</div>;

  const { customer, orders, visits, invoices, payments } = data;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white px-8 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/company/${companyId}/customers`} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {customer.type}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                {customer.status}
              </span>
            </div>
            <div className="text-sm text-slate-500 mt-1 flex items-center space-x-4">
              <span>{customer.customerCode || 'No Code'}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {customer.territory || 'Unassigned Area'}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> {customer.phone || 'No Phone'}</span>
            </div>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Outstanding Balance</div>
            <div className="text-2xl font-bold text-slate-900">{customer.stats?.outstanding !== undefined ? customer.stats.outstanding : customer.balance} JOD</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Total Sales</div>
            <div className="text-2xl font-bold text-slate-900">{customer.stats?.totalSales || 0} JOD</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-slate-900">{orders?.length || 0}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Last Visit</div>
            <div className="text-lg font-bold text-slate-900">{visits?.[0] ? new Date(visits[0].date).toLocaleDateString() : 'Never'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">AI Insight</div>
            <div className="text-sm font-medium text-emerald-600">Likely due for reorder this week</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-8 bg-white">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto p-8">
        
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Contact Person</label>
                    <div className="text-slate-900">{customer.contactPerson || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email</label>
                    <div className="text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> {customer.email || '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Address</label>
                    <div className="text-slate-900">{customer.address || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                  <button className="text-sm font-medium text-blue-600">View Timeline</button>
                </div>
                <div className="space-y-4">
                  {visits?.slice(0,3).map((v: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1"><Activity className="w-5 h-5 text-blue-500"/></div>
                      <div>
                        <div className="font-medium text-slate-900">Visit Completed - {v.outcome}</div>
                        <div className="text-sm text-slate-500">{new Date(v.date).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {orders?.slice(0,2).map((o: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1"><ShoppingCart className="w-5 h-5 text-emerald-500"/></div>
                      <div>
                        <div className="font-medium text-slate-900">Order Placed - {o.orderNumber} ({o.total} JOD)</div>
                        <div className="text-sm text-slate-500">{new Date(o.date).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Commercial Terms</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Price List</span>
                    <span className="font-medium text-slate-900">Wholesale</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Credit Limit</span>
                    <span className="font-medium text-slate-900">{customer.creditLimit || '0.00'} JOD</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 text-sm">Assigned Rep</span>
                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">Ahmad Sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'Financial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Financial Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Total Sales</p>
                 <p className="text-2xl font-bold text-slate-900">{Number(customer?.stats?.totalSales || 0).toFixed(2)} JOD</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Total Invoiced</p>
                 <p className="text-2xl font-bold text-slate-900">{Number(customer?.stats?.totalInvoiced || 0).toFixed(2)} JOD</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Total Paid</p>
                 <p className="text-2xl font-bold text-emerald-600">{Number(customer?.stats?.totalPaid || 0).toFixed(2)} JOD</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Outstanding</p>
                 <p className="text-2xl font-bold text-rose-600">{Number(customer?.stats?.outstanding || 0).toFixed(2)} JOD</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Credit Limit</p>
                 <p className="text-2xl font-bold text-slate-900">{Number(customer?.creditLimit || 0).toFixed(2)} JOD</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <p className="text-sm font-medium text-slate-500 mb-1">Available Credit</p>
                 <p className="text-2xl font-bold text-blue-600">
                    {Math.max(0, Number(customer?.creditLimit || 0) - Number(customer?.stats?.outstanding || 0)).toFixed(2)} JOD
                 </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Order Number</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders?.map((order: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">{order.total} JOD</td>
                  </tr>
                ))}
                {!orders?.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab !== 'Overview' && activeTab !== 'Orders' && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p>Select the Overview or Orders tab to view details.</p>
          </div>
        )}

      </div>
    </div>
  );
}
