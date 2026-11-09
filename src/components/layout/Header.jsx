import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  ChevronDown,
  User,
  UserX,
  Crown,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Boxes,
  TrendingUp,
  CheckCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, PERMISSIONS, ROLE_HUMAN_TITLES } from '../../utils/constants';
import ThemeToggle from '../common/ThemeToggle';
import UserAvatar from '../common/UserAvatar';
import CalendarDropdown from '../common/CalendarDropdown';

export const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { hasPermission } = usePermission();
  const { info } = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Dynamic notification list with read tracking
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Low Inventory Alert',
      message: '4 catalog products reached critical restock thresholds (≤10 units).',
      time: '10m ago',
      icon: AlertTriangle,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
      read: false,
      link: '/products',
    },
    {
      id: 2,
      title: 'RBAC Policy Synchronized',
      message: 'Administrator updated role permissions across Manager tier.',
      time: '45m ago',
      icon: ShieldCheck,
      iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
      read: false,
      link: '/admin/settings',
    },
    {
      id: 3,
      title: 'REST API Catalog Synced',
      message: '100 products retrieved with 200 OK from DummyJSON API.',
      time: '2h ago',
      icon: Boxes,
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      read: false,
      link: '/products',
    },
    {
      id: 4,
      title: 'WebAuthn Passkey Verified',
      message: 'Biometric passkey verified for session Sarah Connor (Admin).',
      time: '4h ago',
      icon: Sparkles,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      read: false,
      link: '/profile',
    },
    {
      id: 5,
      title: 'Valuation Audit Ready',
      message: 'Monthly financial report ready for export (₹1,48,250 net assets).',
      time: '6h ago',
      icon: TrendingUp,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
      read: false,
      link: '/reports',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    info('All pending notifications marked as read', 'Notifications');
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    info('You have been safely signed out.', 'Signed Out');
    navigate('/login', { replace: true });
  };

  const userRole = currentUser?.role || ROLES.ADMIN;
  const humanRoleTitle = ROLE_HUMAN_TITLES[userRole] || 'Executive Administrator';
  const canAccessSettings = userRole === ROLES.ADMIN || hasPermission(PERMISSIONS.SETTINGS, userRole);
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Admin';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0d1527]/95 backdrop-blur border-b border-slate-200/90 dark:border-slate-800/90 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors duration-200 shadow-2xs">
      {/* Left side: Hamburger button + Search Bar */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:outline-none transition-colors border border-slate-200/80 dark:border-slate-800"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-xs sm:max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products, records, or SKU..."
            className="w-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right side: Date Pill, Notification Bell, Settings, Fullscreen, ThemeToggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" ref={dropdownRef}>
        {/* Interactive Calendar Date Dropdown */}
        <div className="hidden md:block">
          <CalendarDropdown />
        </div>

        {/* Notification Bell with Badge & Interactive Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative p-2 rounded-xl transition-all ${
              notifOpen
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 ring-2 ring-blue-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={`Notifications (${unreadCount} unread alerts)`}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#0d1527] shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2.5 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0c1427] border border-slate-200/90 dark:border-slate-800 shadow-2xl p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Notifications</h4>
                  {unreadCount > 0 ? (
                    <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      All caught up
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto my-1 pr-1 custom-sidebar-scroll">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRead(item.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 my-1 ${
                        !item.read
                          ? 'bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100/80 dark:border-blue-900/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${item.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-bold truncate leading-tight ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {item.message}
                        </p>
                      </div>

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" title="Unread alert" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Real-time alert monitoring</span>
                <Link
                  to="/admin/settings"
                  onClick={() => setNotifOpen(false)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Audit Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        {canAccessSettings ? (
          <Link
            to="/admin/settings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
            title="System & Permission Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/profile"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
            title="Profile & Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        )}

        {/* Fullscreen Expand Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:inline-flex"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Premium Light & Dark Mode Slider Switch */}
        <ThemeToggle size="md" />

        {/* User profile dropdown trigger */}
        <div className="relative pl-1">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <UserAvatar user={currentUser} size="md" showStatus={true} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {firstName}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
                Main Branch
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {currentUser?.email || 'admin@enterprise.com'}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-bold border border-purple-200 dark:border-purple-800">
                    {humanRoleTitle}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Main Branch
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Identity & Passkeys</span>
                </Link>

                {canAccessSettings && (
                  <Link
                    to="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-400 font-medium"
                  >
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Role & Access Settings</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium text-left"
                >
                  <UserX className="w-4 h-4 text-rose-500" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
