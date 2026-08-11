import React from 'react';
import { useParams } from 'react-router-dom';

export function SalesAnalytics() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales orders analytics</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Sales orders analytics</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
            <div className="flex gap-2">
              <button className="px-6 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                Filter
              </button>
              <button className="px-6 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
                Export to excel
              </button>
            </div>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Client chain</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No client chains</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client channel</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No client channels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Team</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No teams</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select a country</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Please select a country first</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Please select a state first</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Variant</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select a product to select variants</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-Category</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>no sub-categories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Promotion</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum amount</label>
              <input type="text" placeholder="Minimum amount" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Maximum amount</label>
              <input type="text" placeholder="Maximum amount" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Sales orders stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase">LINE TOTAL</h3>
              <p className="text-3xl font-bold text-blue-900">0</p>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase">TOTAL TAX</h3>
              <p className="text-3xl font-bold text-blue-900">0</p>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase">TOTAL BEFORE TAX</h3>
              <p className="text-3xl font-bold text-blue-900">0</p>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase">TOTAL ORDERS</h3>
              <p className="text-3xl font-bold text-blue-900">0</p>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Sales orders analytics</h2>
            
            <div className="flex rounded-lg border border-slate-300 overflow-hidden">
              <button className="px-4 py-1.5 text-sm font-medium bg-slate-700 text-white">All</button>
              <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Sale Orders</button>
              <button className="px-4 py-1.5 text-sm font-medium bg-white text-blue-600 hover:bg-slate-50 border-l border-slate-300">Pre-Sale Orders</button>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 rounded-xl flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-center">Order Id</th>
                  <th className="px-4 py-4 text-center">Type</th>
                  <th className="px-4 py-4 text-center">Visit Id</th>
                  <th className="px-4 py-4 text-center">Client</th>
                  <th className="px-4 py-4 text-center">Rep</th>
                  <th className="px-4 py-4 text-center">Editor</th>
                  <th className="px-4 py-4 text-center">Company</th>
                  <th className="px-4 py-4 text-center">Total amount</th>
                  <th className="px-4 py-4 text-center">Total tax</th>
                  <th className="px-4 py-4 text-center">Total items</th>
                  <th className="px-4 py-4 text-center">Payment method</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Payment status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={14} className="px-4 py-12 text-center text-slate-400 font-medium">
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
