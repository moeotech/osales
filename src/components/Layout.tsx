import { ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LogIn, Loader2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dbUser, loading, login, logout } = useAuth();
  
  // Very simple routing logic to determine if we are in a company context
  const companyMatch = location.pathname.match(/\/company\/([^/]+)/);
  const currentCompanyId = companyMatch ? companyMatch[1] : null;

  const isSuperAdmin = dbUser?.role === 'superadmin';
  const activeCompanyId = currentCompanyId || (isSuperAdmin ? null : dbUser?.tenantId);

  useEffect(() => {
    if (!loading && user && dbUser) {
      if (!isSuperAdmin && location.pathname === '/') {
        if (dbUser.role === 'sales_rep' || dbUser.role === 'merchandiser') {
          navigate('/rep');
        } else {
          navigate(`/company/${dbUser.tenantId}`);
        }
      }
    }
  }, [loading, user, dbUser, isSuperAdmin, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <span className="text-2xl font-bold text-white tracking-wider">OS</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">OSales SaaS</h1>
          <p className="text-slate-500 mt-2">Field Force & Sales Automation</p>
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
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentCompanyId={activeCompanyId} 
        onClearCompany={() => navigate('/')} 
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium">
              Active Context: <span className="text-blue-600">{activeCompanyId ? `Company ID: ${activeCompanyId.slice(0,8)}...` : 'Global Platform'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {dbUser?.role || 'User'}
            </div>
            <button 
              onClick={logout}
              className="flex items-center justify-center text-slate-400 hover:text-slate-600"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs overflow-hidden">
              {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : 'OS'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
