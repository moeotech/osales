import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Navigation, User, Clock } from 'lucide-react';

export function LiveMap() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Field Map</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Live Map</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 flex justify-between items-center">
            Active Representatives
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">3 Online</span>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Khaled</div>
                  <div className="text-xs text-emerald-600 font-medium">Visit in Progress</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Danube Nakhlah</div>
                <div className="flex gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Last update: 2 mins ago</div>
              </div>
            </div>

            <div className="p-3 border border-slate-100 hover:border-slate-300 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Ahmad</div>
                  <div className="text-xs text-slate-500 font-medium">On the road</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex gap-1.5"><Navigation className="w-3.5 h-3.5 text-slate-400" /> Moving to: Panda Supermarket</div>
                <div className="flex gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Last update: 5 mins ago</div>
              </div>
            </div>
            
            <div className="p-3 border border-slate-100 hover:border-slate-300 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Omar</div>
                  <div className="text-xs text-slate-500 font-medium">Offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-slate-200 rounded-xl shadow-sm border border-slate-300 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'#9C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
          <div className="text-center relative z-10">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-600">Map Integration Ready</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Google Maps Platform / Leaflet integration point. Coordinates are stored in the database for each visit and check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
