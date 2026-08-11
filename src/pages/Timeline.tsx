import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, MapPin, Search, Activity, CheckCircle, ShoppingCart, DollarSign } from 'lucide-react';

export function Timeline() {
  const { companyId } = useParams<{ companyId: string }>();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/timeline`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setEvents(res.timeline || []);
        setLoading(false);
      })
      .catch(console.error);
  }, [companyId]);

  const formatLocalTime = (utcString: string) => {
    // Correct timezone handling by parsing UTC and displaying local
    return new Date(utcString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rep Activity Timeline</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Timeline</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {events.map((event, idx) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 text-sm font-bold text-slate-700">{formatLocalTime(event.time)}</div>
                {idx < events.length - 1 && <div className="w-px h-full bg-slate-200 my-2" />}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{event.rep}</span>
                  <span className="text-slate-500 text-sm">at</span>
                  <span className="font-medium text-blue-600 cursor-pointer">{event.customer}</span>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  {event.type === 'check_in' && <><MapPin className="w-5 h-5 text-emerald-500"/> <span className="text-emerald-700 font-medium">Check-in</span></>}
                  {event.type === 'check_out' && <><MapPin className="w-5 h-5 text-slate-400"/> <span className="text-slate-600 font-medium">Check-out</span></>}
                  {event.type === 'photo' && <><Activity className="w-5 h-5 text-blue-500"/> <span className="text-slate-700">{event.details}</span></>}
                  {event.type === 'form' && <><CheckCircle className="w-5 h-5 text-purple-500"/> <span className="text-slate-700">{event.details}</span></>}
                  {event.type === 'order' && <><ShoppingCart className="w-5 h-5 text-amber-500"/> <span className="text-slate-700 font-medium">{event.details}</span></>}
                  {event.type === 'payment' && <><DollarSign className="w-5 h-5 text-emerald-600"/> <span className="text-slate-700 font-medium">{event.details}</span></>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
