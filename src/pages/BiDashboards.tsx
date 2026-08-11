import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Filter, 
  MoreVertical,
  GripVertical
} from 'lucide-react';



const WIDGET_CATEGORIES = [
  'Products',
  'Representatives',
  'Visits',
  'Product Categories',
  'Teams',
  'Clients',
  'Area tags',
  'Forms'
];

export function BiDashboards() {
  const { companyId } = useParams();
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/dashboard/kpis`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => setKpis(res.kpis))
      .catch(console.error);
  }, [companyId]);

  const DASHBOARD_WIDGETS = kpis ? [
    { id: '1', title: 'Total Orders', value: kpis.totalOrders?.toString() || '0', trend: '', trendUp: true, type: 'metric' },
    { id: '2', title: 'Total Visits', value: kpis.totalVisits?.toString() || '0', trend: '', type: 'metric' },
    { id: '3', title: 'Total Revenue', value: `${kpis.totalRevenue?.toFixed(2) || '0.00'} JOD`, trend: '', trendUp: true, type: 'metric' },
    { id: '4', title: 'Total Collections', value: `${kpis.totalCollections?.toFixed(2) || '0.00'} JOD`, trend: '', trendUp: true, type: 'metric' }
  ] : [];


  const [view, setView] = useState<'list' | 'editor'>('list');

  if (view === 'editor') {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bi dashboards</h1>
            <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
              <span>Home</span>
              <span>/</span>
              <span className="text-blue-600 cursor-pointer" onClick={() => setView('list')}>Bi dashboards</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-full flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Details</h2>
              <div className="flex space-x-3 mb-6">
                <button 
                  onClick={() => setView('list')}
                  className="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Back
                </button>
                <button className="px-4 py-2 bg-slate-300 text-slate-500 font-medium rounded-lg cursor-not-allowed">
                  Create
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" placeholder="Name" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Local Name</label>
                  <input type="text" placeholder="Local Name" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Widgets Sidebar */}
              <div className="w-64 border-r border-slate-100 p-4 bg-slate-50/50 flex flex-col">
                <h3 className="font-semibold text-slate-700 mb-3">Widgets</h3>
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {WIDGET_CATEGORIES.map((cat, i) => (
                    <div 
                      key={cat}
                      className={`px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                        i === 0 ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Canvas */}
              <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-4 h-48 shadow-sm flex flex-col relative group cursor-move">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Box</div>
                    <div className="flex items-center text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-slate-800">Total products</h3>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 h-48 shadow-sm flex flex-col relative group cursor-move">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">Chart</div>
                    <div className="flex items-center text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-slate-800">Top Performing Products</h3>
                  </div>

                  <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4 h-64 shadow-sm flex flex-col relative group cursor-move">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Table</div>
                    <div className="flex items-center text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-slate-800">Recent products</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard List / View Mode
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bi dashboards</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600">Bi dashboards</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-full">
          <div className="flex items-center space-x-3 mb-8">
            <h2 className="font-semibold text-slate-800">Dashboard (Dashboard )</h2>
            <select className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option>Dashboard (Dashboard )</option>
            </select>
            <button 
              onClick={() => setView('editor')}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Edit
            </button>
            <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DASHBOARD_WIDGETS.map((widget) => (
              <div 
                key={widget.id} 
                className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col ${widget.type === 'chart' ? 'col-span-2' : 'col-span-1'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-slate-600">{widget.title}</h3>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <button className="p-1 hover:bg-blue-50 rounded"><Filter className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-blue-50 rounded"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>

                {widget.type === 'metric' ? (
                  <div className="mt-auto">
                    <div className="text-3xl font-bold text-slate-900">{widget.value}</div>
                    {widget.trend && (
                      <div className={`text-xs font-medium mt-2 inline-flex items-center px-1.5 py-0.5 rounded ${
                        widget.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {widget.trendUp ? '↑' : '↓'} {widget.trend}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-around items-end h-32 mt-4">
                    {([])?.map((d, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
                          {d.label}
                        </div>
                        <div className="font-bold text-slate-900 mt-2">{d.value}</div>
                        <div className="text-xs text-slate-500 w-16 text-center truncate" title={d.sub}>{d.sub}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
