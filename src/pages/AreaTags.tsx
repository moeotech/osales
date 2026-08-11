import React from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export function AreaTags() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Area tags</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Area tags</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Area tags</h2>
            
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
                <button className="px-4 py-1.5 text-sm font-medium bg-slate-700 text-white">All</button>
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
                  <th className="px-4 py-4 text-center">Company</th>
                  <th className="px-4 py-4 text-center">Country</th>
                  <th className="px-4 py-4 text-center">State</th>
                  <th className="px-4 py-4 text-center">City</th>
                  <th className="px-4 py-4 text-center">Editor</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4 text-center font-medium text-slate-900">Albostan Alakhdar</td>
                  <td className="px-4 py-4 text-center text-slate-600">Al-Bostan Al-Akhdar</td>
                  <td className="px-4 py-4 text-center text-slate-600">Saudi Arabia</td>
                  <td className="px-4 py-4 text-center text-slate-600">Riyadh</td>
                  <td className="px-4 py-4 text-center text-slate-600">Riyadh</td>
                  <td className="px-4 py-4 text-center text-slate-600">Al-Bostan Al-Akhdar</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="px-3 py-1 bg-slate-700 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-slate-500">
              <span className="mr-2">Rows per page:</span>
              <select className="border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>10</option>
              </select>
              <span className="ml-4">Showing 1-1 of 1</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-slate-200 text-slate-500 rounded cursor-not-allowed">
                Prev
              </button>
              <button className="px-3 py-1 text-sm bg-slate-700 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm bg-slate-200 text-slate-500 rounded cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
