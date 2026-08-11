import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MapPin, Route, Settings, LogOut, Package, ShoppingCart, CalendarCheck, BarChart3, Activity, FileText, Bell, Image as ImageIcon, Calendar, Briefcase, ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentCompanyId: string | null;
  onClearCompany: () => void;
}

export function Sidebar({ currentCompanyId, onClearCompany }: SidebarProps) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Auto-expand menus based on current location
  useEffect(() => {
    if (location.pathname.includes('/schedule/')) {
      setExpandedMenus(prev => ({ ...prev, 'Schedule': true }));
    }
    if (location.pathname.includes('/sales/')) {
      setExpandedMenus(prev => ({ ...prev, 'Sales': true }));
    }
    if (location.pathname.includes('/settings/')) {
      setExpandedMenus(prev => ({ ...prev, 'Settings': true }));
    }
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const saasLinks = [
    { name: 'Platform Admin', to: '/', icon: LayoutDashboard },
  ];

  const companyLinks = [
    { name: 'Dashboard', to: `/company/${currentCompanyId}`, icon: LayoutDashboard },
    { 
      name: 'CRM', 
      icon: Building2, 
      hasSubMenu: true,
      subItems: [
        { name: 'Customers', to: `/company/${currentCompanyId}/customers` },
        { name: 'Territories', to: `/company/${currentCompanyId}/settings/area-tags` },
      ]
    },
    { 
      name: 'Field Force', 
      icon: Users, 
      hasSubMenu: true,
      subItems: [
        { name: 'Representatives', to: `/company/${currentCompanyId}/team` },
        { name: 'Live Map Tracking', to: `/company/${currentCompanyId}/map` },
        { name: 'Visits', to: `/company/${currentCompanyId}/visits` },
        { name: 'Route Planning', to: `/company/${currentCompanyId}/schedule/routes` },
      ]
    },
    { 
      name: 'Sales & Orders', 
      icon: ShoppingCart, 
      hasSubMenu: true,
      subItems: [
        { name: 'Orders', to: `/company/${currentCompanyId}/sales/orders` },
        { name: 'Invoices', to: `/company/${currentCompanyId}/sales/invoices` },
        { name: 'Payments & Collections', to: `/company/${currentCompanyId}/sales/payments` },
        { name: 'Promotions', to: `/company/${currentCompanyId}/sales/promotions` },
        { name: 'Returns', to: `/company/${currentCompanyId}/sales/returns` },
        { name: 'Products & Pricing', to: `/company/${currentCompanyId}/products` },
        { name: 'Product Categories', to: `/company/${currentCompanyId}/product-categories` },
      ]
    },
    { 
      name: 'Inventory', 
      icon: Package, 
      hasSubMenu: true,
      subItems: [
        { name: 'Warehouses', to: `/company/${currentCompanyId}/sales/warehouses` },
        { name: 'Van Inventory', to: `/company/${currentCompanyId}/sales/stock-movements` },
        { name: 'Stock Transfers', to: `/company/${currentCompanyId}/sales/stock-movements` },
      ]
    },
    { 
      name: 'Merchandising', 
      icon: ImageIcon, 
      hasSubMenu: true,
      subItems: [
        { name: 'Shelf Audits', to: `/company/${currentCompanyId}/reports` },
        { name: 'Forms', to: `/company/${currentCompanyId}/forms` },
      ]
    },
    { 
      name: 'BI & AI', 
      icon: Activity, 
      hasSubMenu: true,
      subItems: [
        { name: 'AI Insights', to: `/company/${currentCompanyId}/ai-journey` },
        { name: 'Dashboards', to: `/company/${currentCompanyId}/bi-dashboards` },
        { name: 'KPIs & Targets', to: `/company/${currentCompanyId}/reports` },
      ]
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      hasSubMenu: true,
      subItems: [
        { name: 'Company Settings', to: `/company/${currentCompanyId}/settings/teams` },
        { name: 'Users & Roles', to: `/company/${currentCompanyId}/managers` },
      ]
    },
  ];

  const links = currentCompanyId ? companyLinks : saasLinks;

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-slate-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xl">Σ</div>
        <span className="text-white font-semibold text-lg tracking-tight">OSales SaaS</span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 pb-2">
            {currentCompanyId ? 'Company Context' : 'Core System'}
          </div>
          {links.map((item) => {
            const Icon = item.icon;
            
            if (item.hasSubMenu) {
              const isExpanded = expandedMenus[item.name];
              const isActive = location.pathname.includes(`/${item.name.toLowerCase()}/`);
              
              return (
                <div key={item.name} className="flex flex-col space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={twMerge(
                      clsx(
                        'flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors',
                        isActive && !isExpanded
                          ? 'bg-slate-800 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      )
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={clsx('w-5 h-5 shrink-0', (isActive && !isExpanded) ? 'text-white' : 'text-slate-300')} />
                      <span>{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  
                  {isExpanded && item.subItems && (
                    <div className="flex flex-col space-y-1 pl-10 pr-2 pb-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.to}
                          className={({ isActive: isSubActive }) =>
                            twMerge(
                              clsx(
                                'block px-3 py-2 rounded-md text-sm transition-colors',
                                isSubActive
                                  ? 'bg-blue-600/10 text-blue-400 font-medium'
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                              )
                            )
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.to || '#'}
                end={item.to === '/' || item.to === `/company/${currentCompanyId}`}
                className={({ isActive }) =>
                  twMerge(
                    clsx(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'hover:bg-slate-800'
                    )
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={clsx(
                        'w-5 h-5 shrink-0',
                        isActive ? 'text-white' : 'text-slate-300'
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800 m-4 bg-slate-800/50 rounded-xl">
        {currentCompanyId ? (
          <button 
            onClick={onClearCompany}
            className="flex w-full items-center text-sm font-medium hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Exit Company View
          </button>
        ) : (
          <div className="flex w-full items-center text-sm font-medium text-slate-300">
            <Settings className="mr-3 h-5 w-5" />
            Super Admin
          </div>
        )}
      </div>
    </div>
  );
}
