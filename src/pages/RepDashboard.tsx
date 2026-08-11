import React from 'react';
import { Target, CheckCircle2, Circle, ChevronRight, UserPlus, FileText, CreditCard, Navigation, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RepDashboard() {
  // Mobile-first design for Sales Rep
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-slate-400 text-sm">Good Morning,</p>
            <h1 className="text-2xl font-bold">Ahmad</h1>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
            <span className="text-lg font-bold">AH</span>
          </div>
        </div>

        {/* Target Progress */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Today's Target</span>
            <span className="font-bold">7,500 JOD</span>
          </div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-3xl font-black text-white">4,820</span>
              <span className="text-slate-400 text-sm ml-1">JOD</span>
            </div>
            <span className="text-emerald-400 font-bold text-xl">64%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '64%' }}></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 mt-6">
        
        {/* Today's Visits */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-black text-slate-500 tracking-wider uppercase">Today's Visits</h2>
            <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-full">5 Total</span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            
            <div className="flex items-center p-4 border-b border-slate-50 bg-slate-50/50 opacity-60">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />
              <div className="flex-1">
                <p className="font-bold text-slate-700 line-through">ABC Pharmacy</p>
                <p className="text-xs text-slate-400">Completed 09:15 AM</p>
              </div>
            </div>

            <div className="flex items-center p-4 border-b border-slate-50 bg-slate-50/50 opacity-60">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />
              <div className="flex-1">
                <p className="font-bold text-slate-700 line-through">Al Noor Market</p>
                <p className="text-xs text-slate-400">Completed 10:30 AM</p>
              </div>
            </div>

            <div className="flex items-center p-4 border-b border-slate-100 bg-blue-50/30 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <ChevronRight className="w-5 h-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="font-bold text-blue-900">City Supermarket</p>
                <p className="text-xs text-blue-500 font-medium">Next • 2.5 km away</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">Start</button>
            </div>

            <div className="flex items-center p-4 border-b border-slate-50">
              <Circle className="w-5 h-5 text-slate-300 mr-3" />
              <div className="flex-1">
                <p className="font-bold text-slate-700">Modern Store</p>
                <p className="text-xs text-slate-400">Planned 02:00 PM</p>
              </div>
            </div>

            <div className="flex items-center p-4">
              <Circle className="w-5 h-5 text-slate-300 mr-3" />
              <div className="flex-1">
                <p className="font-bold text-slate-700">Al Amal Pharmacy</p>
                <p className="text-xs text-slate-400">Planned 03:30 PM</p>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-black text-slate-500 tracking-wider uppercase mb-4">Quick Action</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">New Customer</span>
            </button>
            
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">New Order</span>
            </button>
            
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">Payment</span>
            </button>
            
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Navigation className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">Unplanned Visit</span>
            </button>
          </div>
        </section>

      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-lg pb-safe">
        <button className="flex flex-col items-center text-blue-600">
          <Activity className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Today</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
          <Navigation className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Route</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
          <CreditCard className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>
      </div>

    </div>
  );
}
