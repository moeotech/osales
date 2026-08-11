import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Upload } from 'lucide-react';

export function Managers() {
  const { companyId } = useParams<{ companyId: string }>();
  const [view, setView] = useState<'list' | 'add'>('list');

  if (view === 'add') {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Managers</h1>
            <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
              <span>Home</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-slate-900" onClick={() => setView('list')}>Managers</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="password" placeholder="Password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <div className="bg-slate-50 px-3 py-2 border-r border-slate-300 flex items-center text-lg leading-none">
                    🇸🇦
                  </div>
                  <input type="text" placeholder="+966" className="flex-1 px-3 py-2 text-sm focus:outline-none" />
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
          <h1 className="text-2xl font-bold text-slate-900">Managers</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Managers</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Managers</h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex rounded-lg border border-slate-300 overflow-hidden mr-2">
                <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white">All</button>
                <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Active</button>
                <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Inactive</button>
              </div>

              <button 
                onClick={() => setView('add')}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-center">Image</th>
                  <th className="px-4 py-4 text-center">Name</th>
                  <th className="px-4 py-4 text-center">Email</th>
                  <th className="px-4 py-4 text-center">Phone</th>
                  <th className="px-4 py-4 text-center">Editor</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-blue-400/70 font-medium">
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
