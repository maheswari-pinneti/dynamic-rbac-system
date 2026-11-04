import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Boxes,
  FileText,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  X,
  LogOut,
  Layers,
  Crown,
  Activity,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useToast } from '../../context/ToastContext';
import { PERMISSIONS, ROLES, ROLE_HUMAN_TITLES } from '../../utils/constants';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { hasPermission } = usePermission();
  const { info } = useToast();
  const navigate = useNavigate();

  const userRole = currentUser?.role || ROLES.ADMIN;
  const humanRoleTitle = ROLE_HUMAN_TITLES[userRole] || 'Executive Administrator';

  const handleLogout = () => {
    logout();
    info('You have safely signed out of your session. Welcome back anytime!', 'Signed Out');
    navigate('/login', { replace: true });
  };

  // Navigation Items matching the Dynamic RBAC PRD Requirements
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      permission: PERMISSIONS.DASHBOARD,
      exact: true,
      description: 'Key metrics & pulse',
    },
    {
      name: 'Analytics Dashboard',
      path: '/analytics',
      icon: BarChart3,
      permission: PERMISSIONS.ANALYTICS,
      badge: 'Live',
      description: 'Charts & distributions',
    },
    {
      name: 'Product Records',
      path: '/products',
      icon: Boxes,
      permission: PERMISSIONS.VIEW_RECORDS,
      badge: 'REST API',
      description: 'Full CRUD & catalog',
    },
    {
      name: 'Reports & Export',
      path: '/reports',
      icon: FileText,
      permission: PERMISSIONS.REPORTS,
      description: 'Valuation & CSV export',
    },
    {
      name: 'Admin Settings',
      path: '/admin/settings',
      icon: ShieldCheck,
      permission: PERMISSIONS.SETTINGS,
      adminOnly: true,
      badge: 'Admin',
      description: 'Dynamic RBAC matrix',
    },
    {
      name: 'Profile & Security',
      path: '/profile',
      icon: UserCheck,
      permission: PERMISSIONS.PROFILE,
      description: 'Identity & passkeys',
    },
  ];

  // Dynamic filter based on runtime RBAC permissions (Module 6 requirement)
  const visibleNavItems = navItems.filter((item) => {
    if (userRole === ROLES.ADMIN) return true;
    if (item.adminOnly && userRole !== ROLES.ADMIN) return false;
    return hasPermission(item.permission, userRole);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Midnight Navy matching screenshot */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#091124] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 shadow-2xl lg:shadow-none select-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-[#070d1c]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white flex-shrink-0">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-white tracking-tight leading-tight truncate">
                Dynamic RBAC
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-tight truncate">
                Enterprise Access System
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 custom-sidebar-scroll">
          <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Modules ({visibleNavItems.length} Active)</span>
            <span className="text-blue-400 font-mono text-[10px]">RBAC Live</span>
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-blue-400 transition-colors'
                        }`}
                      />
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="truncate leading-tight">{item.name}</span>
                        <span
                          className={`text-[10px] truncate leading-tight ${
                            isActive ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : item.badge === 'Admin'
                              ? 'bg-purple-950/70 text-purple-400 border border-purple-800/80'
                              : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/80'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-white/80 translate-x-0.5'
                            : 'text-slate-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left mt-3 border border-transparent hover:border-rose-900/50"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-rose-500 group-hover:rotate-6 transition-transform" />
              <span>Sign Out</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-rose-500/70" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
