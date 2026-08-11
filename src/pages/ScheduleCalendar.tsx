import React from 'react';
import { useParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function ScheduleCalendar() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span>Schedule</span>
            <span>/</span>
            <span className="text-slate-900">Calendar</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px] flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Rep</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Client</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Plans</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Rules</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Clear Filters
            </button>
          </div>

          <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex space-x-2">
                <button className="p-1.5 border border-slate-300 rounded hover:bg-slate-50">
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-1.5 border border-slate-300 rounded hover:bg-slate-50">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <h2 className="text-sm font-bold text-slate-800">August 2026</h2>
              <div className="w-16"></div> {/* Spacer to center title */}
            </div>

            <div className="flex-1 grid grid-cols-7 border-b border-slate-200 bg-white">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="px-4 py-3 text-[10px] font-bold text-slate-400 border-r border-slate-200 last:border-r-0 uppercase text-center">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="flex-1 bg-white relative">
              <div className="absolute inset-0 grid grid-cols-7 grid-rows-5">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-slate-200 p-2 relative h-32 overflow-hidden">
                    {/* Placeholder for calendar logic */}
                    <span className="text-xs font-semibold text-slate-600">{(i % 31) + 1}</span>
                    
                    {/* Example Events */}
                    {i === 2 && (
                      <div className="mt-2 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-medium bg-blue-50 text-blue-700 border-l-2 border-blue-500 rounded truncate">
                          Alsayed1-Danoube Al
                        </div>
                        <div className="px-2 py-1 text-[10px] font-medium bg-blue-50 text-blue-700 border-l-2 border-blue-500 rounded truncate">
                          Khaledmosbah3-Dan
                        </div>
                      </div>
                    )}
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
