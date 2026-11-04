import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_HUMAN_TITLES } from '../../utils/constants';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AccessDenied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRole } = useAuth();

  const state = location.state || {};
  const attemptedPath = state.path || 'the requested module';
  const required = state.required || 'Administrator Privilege';
  const userRole = state.userRole || currentUser?.role || ROLES.EMPLOYEE;
  const humanRole = ROLE_HUMAN_TITLES[userRole] || 'Staff User';
  const reason =
    state.reason ||
    'You do not have authorization to view this section based on policies set in the Dynamic Permission Matrix.';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-8 text-center">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold mb-3">
          <Lock className="w-3 h-3" />
          <span>HTTP 403 • Access Denied</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Access Restricted
        </h1>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {reason}
        </p>

        {/* Security Context Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Current Role:</span>
            <div className="flex items-center gap-1.5">
              <Badge role={userRole} size="sm" dot />
              <span className="font-bold text-slate-800 dark:text-slate-200">({humanRole})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Target Route:</span>
            <code className="text-slate-800 dark:text-slate-200 font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
              {attemptedPath}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Required Authorization:</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">{required}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={LayoutDashboard}
              className="w-full sm:w-auto"
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>

        {/* RBAC Evaluation Helper */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Testing RBAC Permissions? </span>
          <button
            type="button"
            onClick={() => {
              switchRole(ROLES.ADMIN);
              navigate('/admin/settings');
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold underline inline-flex items-center gap-1"
          >
            Switch to Admin (Sarah) to reconfigure matrix
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
