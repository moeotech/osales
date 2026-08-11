import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Customer, SalesRep, JourneyStop } from '../types';
import { Sparkles, MapPin, Clock, ArrowRight, Route as RouteIcon, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function AIJourney() {
  const { companyId } = useParams<{ companyId: string }>();
  
  const [reps, setReps] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/users`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
      .then(res => res.json()).then(res => setReps(res.users || []));
    fetch(`/api/tenants/${companyId}/customers`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
      .then(res => res.json()).then(res => setCustomers(res.customers || []));
  }, [companyId]);

  const [selectedRep, setSelectedRep] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPlan, setJourneyPlan] = useState<JourneyStop[] | null>(null);
  const [error, setError] = useState('');

  const rep = reps.find(r => r.id === selectedRep);

  const toggleCustomer = (id: string) => {
    const next = new Set(selectedCustomers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCustomers(next);
  };

  const handleGenerate = async () => {
    if (!rep) return;
    if (selectedCustomers.size === 0) {
      setError('Please select at least one customer to visit.');
      return;
    }
    setError('');
    setIsLoading(true);
    setJourneyPlan(null);

    const customersToVisit = customers.filter(c => selectedCustomers.has(c.id));

    try {
      const response = await fetch('/api/ai/journey-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rep: { name: rep.name },
          startingLocation: rep.currentLocation,
          customers: customersToVisit.map(c => ({ name: c.name, location: c.location, status: c.status }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate journey plan');
      }

      const data = await response.json();
      setJourneyPlan(data.schedule);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-indigo-600" />
          AI Journey Planner
        </h2>
        <p className="text-sm text-slate-500 mt-1">Optimize daily field routes using Google Gemini to minimize travel time and maximize sales potential.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">1. Select Representative</h3>
            <select 
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
            >
              <option value="">-- Choose Rep --</option>
              {reps.map(r => (
                <option key={r.id} value={r.id}>{r.name} (Start: {r.currentLocation})</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">2. Select Customers to Visit</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {customers.map(c => (
                <label key={c.id} className="flex items-start space-x-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedCustomers.has(c.id)}
                    onChange={() => toggleCustomer(c.id)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{c.name}</span>
                    <span className="text-xs text-slate-500 flex items-center mt-1"><MapPin className="h-3 w-3 mr-1"/>{c.location}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!selectedRep || selectedCustomers.size === 0 || isLoading}
            className="w-full flex items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RouteIcon className="mr-2 h-5 w-5" />}
            Generate Optimized Route
          </button>
          
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-full min-h-[500px] flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <h3 className="text-base font-bold text-slate-900">Itinerary Schedule</h3>
              {journeyPlan && <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">AI Optimized</span>}
            </div>
            
            <div className="p-6 flex-1">
              {!journeyPlan && !isLoading && (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 space-y-4">
                  <Sparkles className="h-12 w-12 text-slate-300" />
                  <p className="max-w-xs text-sm">Select a representative and customers, then generate the AI-optimized journey plan.</p>
                </div>
              )}

              {isLoading && (
                <div className="flex h-full flex-col items-center justify-center text-center text-indigo-600 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="text-sm font-medium animate-pulse">Calculating optimal routes via Gemini AI...</p>
                </div>
              )}

              {journeyPlan && (
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                  {journeyPlan.map((stop, index) => (
                    <div key={index} className="relative pl-6">
                      <div className={clsx(
                        "absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-white",
                        stop.action.toLowerCase().includes('visit') ? 'bg-indigo-600' : 'bg-slate-400'
                      )}></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-slate-900 mr-2">{stop.action}</span>
                            {stop.customerName && <span className="text-sm font-medium text-indigo-600">- {stop.customerName}</span>}
                          </div>
                          <p className="text-sm text-slate-600 mt-1 flex items-start">
                            <MapPin className="h-4 w-4 mr-1 text-slate-400 mt-0.5 shrink-0" />
                            {stop.location}
                          </p>
                          {stop.notes && (
                            <div className="mt-2 text-sm text-slate-500 bg-slate-50 rounded p-2 border border-slate-100 inline-block">
                              {stop.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0 text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          <Clock className="h-4 w-4 mr-1.5" />
                          {stop.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
