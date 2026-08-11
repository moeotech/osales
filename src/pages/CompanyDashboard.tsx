import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, TrendingUp, Users, Map, DollarSign, ShoppingCart, CheckCircle, Clock } from 'lucide-react';

import { clsx } from 'clsx';



export function CompanyDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState({ name: 'OSales Tenant' });
  useEffect(() => {
    fetch(`/api/tenants`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
      .then(res => res.json())
      .then(res => {
         const t = (res.tenants || []).find((x: any) => x.id === companyId);
         if (t) setCompany(t);
      })
      .catch(console.error);
  }, [companyId]);
  
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/dashboard/kpis`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setKpis(res.kpis);
      })
      .catch(console.error);
  }, [companyId]);

  const stats = [
    { name: 'Today\'s Sales', value: `${kpis?.todaysRevenue?.toFixed(2) || '0.00'} JOD`, icon: TrendingUp, change: 'Total: ' + (kpis?.totalRevenue?.toFixed(2) || '0.00'), changeType: 'positive' },
    { name: 'Orders', value: kpis?.todaysOrders || '0', icon: ShoppingCart, change: 'Today', changeType: 'neutral' },
    { name: 'Collections', value: `${kpis?.todaysCollections?.toFixed(2) || '0.00'} JOD`, icon: DollarSign, change: 'Total: ' + (kpis?.totalCollections?.toFixed(2) || '0.00'), changeType: 'positive' },
    { name: 'Visit Compliance', value: `${kpis?.completedVisits || 0} / ${kpis?.plannedVisits || 0}`, icon: CheckCircle, change: `${kpis?.visitCompliance?.toFixed(1) || 0}%`, changeType: 'positive' },
    { name: 'Active Customers', value: kpis?.activeCustomers || '0', icon: Users, change: 'Total assigned', changeType: 'neutral' },
    { name: 'Total Outstanding', value: `${kpis?.outstanding?.toFixed(2) || '0.00'} JOD`, icon: Clock, change: 'All Time', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Executive Sales Dashboard</h2>
          <p className="text-sm text-slate-500">Real-time overview of your commercial performance.</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.name}
            className={clsx(
              "relative overflow-hidden rounded-xl bg-white px-4 pb-12 pt-5 shadow-sm ring-1 ring-slate-200 sm:px-6 sm:pt-6 hover:shadow-md transition-shadow",
              idx === 0 ? "lg:col-span-2 bg-blue-600 text-white ring-blue-700" : ""
            )}
          >
            <dt>
              <div className={clsx(
                "absolute rounded-lg p-3",
                idx === 0 ? "bg-blue-500" : "bg-blue-50"
              )}>
                <stat.icon className={clsx("h-6 w-6", idx === 0 ? "text-white" : "text-blue-600")} aria-hidden="true" />
              </div>
              <p className={clsx("ml-16 truncate text-sm font-medium", idx === 0 ? "text-blue-100" : "text-slate-500")}>{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className={clsx("text-2xl font-bold", idx === 0 ? "text-white" : "text-slate-900")}>{stat.value}</p>
              <div className={clsx("absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6", idx === 0 ? "bg-blue-700" : "bg-slate-50")}>
                <div className="text-sm">
                  <span className={clsx(
                    "font-medium",
                    idx === 0 ? "text-blue-100" :
                    stat.changeType === 'positive' ? 'text-emerald-600' : 
                    stat.changeType === 'negative' ? 'text-rose-600' : 'text-slate-500'
                  )}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-5 flex justify-between items-center">
            <h3 className="text-base font-semibold leading-6 text-slate-900">Sales vs Collections</h3>
          </div>
          <div className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpis?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" name="Sales" dataKey="sales" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" name="Collections" dataKey="collections" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorColl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-base font-semibold leading-6 text-slate-900">Sales Performance</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Rep</th>
                  <th className="px-4 py-3 font-medium text-right">Target</th>
                  <th className="px-4 py-3 font-medium text-right">Sales</th>
                  <th className="px-4 py-3 font-medium text-right">Achieve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Ahmad</td>
                  <td className="px-4 py-3 text-right text-slate-500">10K</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">11.2K</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">112%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Khaled</td>
                  <td className="px-4 py-3 text-right text-slate-500">10K</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">8.4K</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-600">84%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Omar</td>
                  <td className="px-4 py-3 text-right text-slate-500">10K</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">6.8K</td>
                  <td className="px-4 py-3 text-right font-bold text-rose-600">68%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
