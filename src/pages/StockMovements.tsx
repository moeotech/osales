import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export function StockMovements() {
  const { companyId } = useParams<{ companyId: string }>();
  const [activeTab, setActiveTab] = useState('Pending Transfers');

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Movements</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Stock Movements</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex flex-col">
          <div className="border-b border-slate-200 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Warehouse Inventory Movements</h2>
            <div className="flex space-x-4">
              {['Pending Transfers', 'Pending Returns', 'Audit Log', 'Van Stock Overview'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Pending Transfer Requests</h3>
              <p className="text-sm text-slate-500 mt-1">Review stock transfer requests submitted by mobile representatives from their vans.</p>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Refresh Requests
            </button>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-center">Transfer ID</th>
                  <th className="px-4 py-4 text-center">Representative</th>
                  <th className="px-4 py-4 text-center">Destination Van</th>
                  <th className="px-4 py-4 text-center">Item Count</th>
                  <th className="px-4 py-4 text-center">Date Submitted</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-medium">
                    No pending transfer requests found.
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
