import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Upload, Calendar } from 'lucide-react';

export function Reminders() {
  const { companyId } = useParams<{ companyId: string }>();
  const [view, setView] = useState<'list' | 'add'>('list');

  if (view === 'add') {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reminders</h1>
            <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
              <span>Home</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-slate-900" onClick={() => setView('list')}>Reminders</span>
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

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
              <div className="w-48 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 mb-2" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company <span className="text-red-500">*</span></label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Select a company</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Incomplete</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Visit <span className="text-red-500">*</span></label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Select a company first</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" placeholder="Select a date" className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" placeholder="Select a date" className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea rows={4} placeholder="description..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
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
          <h1 className="text-2xl font-bold text-slate-900">Reminders</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Reminders</span>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Team</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No teams</option>
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
            <h2 className="text-lg font-bold text-slate-800">Reminders</h2>
            <button 
              onClick={() => setView('add')}
              className="px-6 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4">Image</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Start date</th>
                  <th className="px-4 py-4">End date</th>
                  <th className="px-4 py-4">Company</th>
                  <th className="px-4 py-4">Visit Id</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Client</th>
                  <th className="px-4 py-4">Rep</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400 font-medium">
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
