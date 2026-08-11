import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export function ScheduleRoutes() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Routes</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span>Schedule</span>
            <span>/</span>
            <span className="text-slate-900">Routes</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Routes</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex rounded-lg border border-slate-300 overflow-hidden mr-2">
                <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white">All</button>
                <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Active</button>
                <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Inactive</button>
              </div>

              <button className="px-4 py-1.5 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                Add
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-center">Name</th>
                  <th className="px-4 py-4 text-center">Clients</th>
                  <th className="px-4 py-4 text-center">Company</th>
                  <th className="px-4 py-4 text-center">Editor</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-medium">
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
