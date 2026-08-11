import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export function Forms() {
  const { companyId } = useParams<{ companyId: string }>();
  const [view, setView] = useState<'list' | 'add'>('list');
  const [fields, setFields] = useState([{ id: 1 }]);

  const addField = () => {
    setFields([...fields, { id: Date.now() }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  if (view === 'add') {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Form</h1>
            <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
              <span>Home</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-slate-900" onClick={() => setView('list')}>Form</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Details</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('list')}
                  className="px-4 py-2 text-sm font-medium bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Back
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-blue-300 text-white rounded-lg cursor-not-allowed">
                  Create
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" placeholder="Name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center hover:border-blue-500 transition-colors"></div>
                  <span className="text-sm text-slate-700 font-medium">Enable Scoring</span>
                </label>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-700">Form Fields</h3>
                  <button 
                    onClick={addField}
                    className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Add field
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="p-4 border border-slate-200 rounded-xl bg-white flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center hover:border-blue-500 transition-colors"></div>
                          <span className="text-sm text-slate-700">Required</span>
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option>Text</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Label (EN)</label>
                            <input type="text" placeholder="Label in English" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Label (AR)</label>
                            <input type="text" placeholder="Label in Arabic" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                      <div className="pt-8">
                        <button 
                          onClick={() => removeField(field.id)}
                          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Forms</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
            <button className="px-6 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Filter
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date range</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select date range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Representative</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clients</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Area tag</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client tag</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No client tags</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select status</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Forms</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button 
                onClick={() => setView('add')}
                className="px-6 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4 text-center">Company</th>
                  <th className="px-4 py-4 text-center">Editor</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium">
                    No data available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
