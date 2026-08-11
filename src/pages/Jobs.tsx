import React from 'react';
import { useParams } from 'react-router-dom';

export function Jobs() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Job</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Details</h2>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Back
              </button>
              <button className="px-4 py-2 bg-blue-200 text-blue-700 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                Create
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select an option</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select an option</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
