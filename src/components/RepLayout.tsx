import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RepLayoutProps {
  children: ReactNode;
}

export function RepLayout({ children }: RepLayoutProps) {
  const { user, dbUser, loading, login } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user || !dbUser) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <span className="text-2xl font-bold text-white tracking-wider">OS</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">OSales Rep</h1>
          <p className="text-slate-500 mt-2">Mobile Sales App</p>
        </div>
        <button
          onClick={login}
          className="flex items-center gap-3 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all hover:shadow-md"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
