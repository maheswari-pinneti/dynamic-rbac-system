import React, { useState } from 'react';
import {
  Crown,
  Briefcase,
  Users,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Footprints,
  UserCheck,
  Smile,
  UserPlus,
  Eye,
  UserMinus,
  Fingerprint,
  ChevronRight,
  HelpingHand,
} from 'lucide-react';
import { usePermission } from '../../context/PermissionContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ROLES,
  PERMISSIONS,
  PERMISSION_DEFINITIONS,
  DEFAULT_PERMISSIONS,
  DEMO_USERS,
  ROLE_HUMAN_TITLES,
  PERMISSION_MODULES,
} from '../../utils/constants';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toggle from '../../components/common/Toggle';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmModal from '../../components/common/ConfirmModal';

export const AdminSettings = () => {
  const {
    permissions,
    savePermissionsMatrix,
    resetToDefaults,
    selectAllForRole,
    clearAllForRole,
    activityLogs,
    permissionDefinitions,
  } = usePermission();

  const { currentUser, switchRole, users, updateUserRole, addUser, deleteUser } = useAuth();
  const { success, info, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'roles'
  const [matrixDraft, setMatrixDraft] = useState(() => JSON.parse(JSON.stringify(permissions)));
  const [selectedMatrixRole, setSelectedMatrixRole] = useState(ROLES.MANAGER);

  const handleSelectAllRole = (role) => {
    setMatrixDraft((prev) => {
      const allTrue = {};
      Object.values(PERMISSIONS).forEach((k) => {
        allTrue[k] = true;
      });
      return {
        ...prev,
        [role]: allTrue,
      };
    });
    info(`All permissions granted for ${role}. Click Save to broadcast.`, 'Bulk Granted');
  };

  const handleClearAllRole = (role) => {
    setMatrixDraft((prev) => {
      const allFalse = {};
      Object.values(PERMISSIONS).forEach((k) => {
        allFalse[k] = false;
      });
      allFalse[PERMISSIONS.PROFILE] = true;
      return {
        ...prev,
        [role]: allFalse,
      };
    });
    info(`All permissions revoked for ${role}. Click Save to broadcast.`, 'Bulk Revoked');
  };
  const [isSaving, setIsSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // User management state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: ROLES.EMPLOYEE,
    department: 'Operations',
    title: 'Operations Specialist',
  });
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const hasUnsavedChanges = JSON.stringify(matrixDraft) !== JSON.stringify(permissions);

  const handleToggle = (role, permissionKey, newValue) => {
    setMatrixDraft((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: newValue,
      },
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    savePermissionsMatrix(matrixDraft, currentUser);
    setIsSaving(false);
    success(
      'Updated permissions saved and applied immediately across all roles!',
      'Permissions Updated'
    );
  };

  const handleConfirmReset = () => {
    resetToDefaults(currentUser);
    setMatrixDraft(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
    setResetModalOpen(false);
    info(
      'All role privileges returned to baseline enterprise defaults.',
      'Permissions Reset'
    );
  };

  // Role Management Handlers
  const handleRoleChange = (userId, userName, newRole) => {
    updateUserRole(userId, newRole);
    success(
      `${userName} is now assigned the "${newRole}" role tier!`,
      'Role Reassigned'
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) {
      toastError('Please provide both name and a corporate email.');
      return;
    }

    addUser(newUserData);
    success(`User ${newUserData.name} added with ${newUserData.role} access!`, 'User Added');
    setAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: ROLES.EMPLOYEE,
      department: 'Operations',
      title: 'Operations Specialist',
    });
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    success(`User record for ${userToDelete.name} has been removed.`, 'User Removed');
    setDeleteUserModalOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dynamic Permission Matrix & Access Governance"
        subtitle="Dynamically determine what Team Managers and Operations Specialists can view, add, modify, and remove."
        badge="Executive Administrator"
        badgeVariant="purple"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'matrix' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={HelpingHand}
                  onClick={() => setResetModalOpen(true)}
                >
                  Reset to Defaults
                </Button>

                <Button
                  variant={hasUnsavedChanges ? 'primary' : 'secondary'}
                  size="sm"
                  icon={HeartHandshake}
                  isLoading={isSaving}
                  onClick={handleSaveAll}
                  className={hasUnsavedChanges ? 'animate-pulse' : ''}
                >
                  {hasUnsavedChanges ? 'Save Changes *' : 'Save Permission Settings'}
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setAddUserModalOpen(true)}
              >
                Add New User
              </Button>
            )}
          </div>
        }
      />

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'matrix'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Dynamic Permission Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage User Roles ({users?.length || 3})</span>
        </button>
      </div>

      {/* TAB 1: DYNAMIC PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Unsaved Changes Banner */}
          {hasUnsavedChanges && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Smile className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>
                  <strong>You have unsaved changes!</strong> Click <em>"Save Permission Settings"</em> to broadcast these updated permissions to all active user sessions.
                </span>
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={handleSaveAll}
                isLoading={isSaving}
              >
                Save Permissions
              </Button>
            </div>
          )}

          {/* Dynamic Permission Matrix Table */}
          <Card
            title="Module-by-Action Permission Matrix"
            subtitle="Granular module authorization matrix with live runtime enforcement across all active user sessions."
            action={
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:flex items-center gap-1.5 mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Dynamic Real-time Broadcast
                </span>
                <Button
                  variant={hasUnsavedChanges ? 'primary' : 'secondary'}
                  size="xs"
                  onClick={handleSaveAll}
                  isLoading={isSaving}
                >
                  {hasUnsavedChanges ? 'Save Changes *' : 'Save Permissions'}
                </Button>
              </div>
            }
          >
            {/* Role Selector Tabs + Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
                  Target Role:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMatrixRole(ROLES.MANAGER)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMatrixRole === ROLES.MANAGER
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={DEMO_USERS[1].avatar}
                    alt="Marcus"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Team Managers ({ROLES.MANAGER})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMatrixRole(ROLES.EMPLOYEE)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMatrixRole === ROLES.EMPLOYEE
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={DEMO_USERS[2].avatar}
                    alt="Elena"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Operations Specialists ({ROLES.EMPLOYEE})</span>
                </button>
              </div>

              {/* Quick Actions: Select All, Clear All, Reset */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAllRole(selectedMatrixRole)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-bold shadow-2xs"
                  title="Grant all module actions to current role"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={() => handleClearAllRole(selectedMatrixRole)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-bold shadow-2xs"
                  title="Revoke all actions from current role"
                >
                  Clear All
                </button>

                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-bold shadow-2xs"
                  title="Reset permissions to enterprise baseline defaults"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Matrix Table: Module | View | Create | Edit | Delete | Export */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-1/3">Module</th>
                    <th className="py-3.5 px-3 text-center w-[13%]">View</th>
                    <th className="py-3.5 px-3 text-center w-[13%]">Create</th>
                    <th className="py-3.5 px-3 text-center w-[13%]">Edit</th>
                    <th className="py-3.5 px-3 text-center w-[13%]">Delete</th>
                    <th className="py-3.5 px-3 text-center w-[13%]">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {PERMISSION_MODULES.map((mod) => {
                    const actions = ['view', 'create', 'edit', 'delete', 'export'];

                    return (
                      <React.Fragment key={mod.id}>
                        <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors font-medium">
                          {/* Module Name & Description */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                              {mod.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {mod.description}
                            </div>
                          </td>

                          {/* Action Columns: View | Create | Edit | Delete | Export */}
                          {actions.map((act) => {
                            const permKey = mod.actions?.[act];

                            if (!permKey) {
                              return (
                                <td key={act} className="py-3 px-3 text-center text-slate-300 dark:text-slate-700 font-bold select-none">
                                  —
                                </td>
                              );
                            }

                            const isAllowed = !!matrixDraft[selectedMatrixRole]?.[permKey];

                            return (
                              <td key={act} className="py-3 px-3 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <Toggle
                                    checked={isAllowed}
                                    onChange={(val) =>
                                      handleToggle(selectedMatrixRole, permKey, val)
                                    }
                                    size="sm"
                                  />
                                  <span
                                    className={`text-[9px] font-bold mt-0.5 ${
                                      isAllowed
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-slate-400 dark:text-slate-500'
                                    }`}
                                  >
                                    {isAllowed ? 'Allowed' : 'Denied'}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>

                        {/* If Dashboard module, display Sub-Widget Toggles */}
                        {mod.widgets && mod.widgets.length > 0 && (
                          <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80">
                            <td colSpan={6} className="py-3 px-4 pl-8">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                <span>Dynamic Dashboard Widget Permissions ({selectedMatrixRole})</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {mod.widgets.map((w) => {
                                  const isWidgetAllowed = !!matrixDraft[selectedMatrixRole]?.[w.key];
                                  return (
                                    <div
                                      key={w.key}
                                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                                    >
                                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 pr-2">
                                        {w.label}
                                      </span>
                                      <Toggle
                                        checked={isWidgetAllowed}
                                        onChange={(val) =>
                                          handleToggle(selectedMatrixRole, w.key, val)
                                        }
                                        size="xs"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Matrix Footer */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <span>
                  Adjusting switches stages your changes. Click <strong>"Save Permissions"</strong> to immediately broadcast these policies to all active user sessions without requiring re-login.
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={HeartHandshake}
                onClick={handleSaveAll}
                isLoading={isSaving}
              >
                Save Permission Settings
              </Button>
            </div>
          </Card>

          {/* User Experience Preview & Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience Simulation Card */}
            <Card
              title="Role Perspective Preview"
              subtitle="Experience what users in each role see based on active permissions"
            >
              <div className="space-y-3.5 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Switch directly into Marcus’s or Elena’s view to verify that buttons, navigation links, and routes reflect the rules you set above.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole(ROLES.MANAGER);
                      info('Switched to Marcus Vance (Team Manager)! Notice the sidebar and actions update accordingly.');
                    }}
                    className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={DEMO_USERS[1].avatar}
                        alt="Marcus"
                        className="w-8 h-8 rounded-full object-cover border border-blue-300 dark:border-blue-700"
                      />
                      <div>
                        <div className="font-bold text-blue-950 dark:text-blue-200">Marcus Vance</div>
                        <div className="text-[10px] text-blue-700 dark:text-blue-400">Team Manager</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                      Test the catalog with Manager permissions. If Delete is enabled, delete buttons appear.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchRole(ROLES.EMPLOYEE);
                      info('Switched to Elena Rostova (Specialist)! Notice restricted actions and routes.');
                    }}
                    className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={DEMO_USERS[2].avatar}
                        alt="Elena"
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300 dark:border-emerald-700"
                      />
                      <div>
                        <div className="font-bold text-emerald-950 dark:text-emerald-200">Elena Rostova</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Operations Specialist</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      Test restricted staff mode. Notice that adding and removing products is guarded.
                    </p>
                  </button>
                </div>
              </div>
            </Card>

            {/* Audit Trail */}
            <Card
              title="Permission Governance Audit Trail"
              subtitle="Recent adjustments made to team access and roles"
            >
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {activityLogs
                  .filter((log) => log.type === 'security' || log.type === 'system')
                  .slice(0, 5)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{log.details}</p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE USER ROLES & ACCOUNTS */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card
            title="User Role Management & Permissions"
            subtitle="Administer organizational role tiers for team members. Role reassignments take effect immediately."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setAddUserModalOpen(true)}
              >
                Add User
              </Button>
            }
          >
            {/* Search filter */}
            <div className="mb-4 relative max-w-sm">
              <Eye className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users by name, role, email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Users & Roles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User Profile</th>
                    <th className="py-3 px-4">Department & Title</th>
                    <th className="py-3 px-4">Passkey Attestation</th>
                    <th className="py-3 px-4">Current Assigned Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const humanTitle = ROLE_HUMAN_TITLES[u.role] || u.role;

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Profile Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                {u.name}
                                {isSelf && (
                                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-semibold">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {u.department || 'Operations'}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.title || humanTitle}</div>
                        </td>

                        {/* Passkey Status */}
                        <td className="py-3 px-4">
                          {u.hasPasskey || u.passkeys?.length > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <Fingerprint className="w-3.5 h-3.5" />
                              Passkey Enrolled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              Password Only
                            </span>
                          )}
                        </td>

                        {/* Dynamic Role Selector */}
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, u.name, e.target.value)}
                            disabled={isSelf}
                            className={`py-1 px-2.5 text-xs font-bold rounded-xl border transition-all ${
                              u.role === ROLES.ADMIN
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                : u.role === ROLES.MANAGER
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            }`}
                            title={isSelf ? 'Cannot change your own active admin role' : 'Reassign role tier'}
                          >
                            <option value={ROLES.ADMIN}>Admin (Master Governance)</option>
                            <option value={ROLES.MANAGER}>Manager (Operational Lead)</option>
                            <option value={ROLES.EMPLOYEE}>Employee (Specialist)</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                switchRole(u.role);
                                info(`Simulating perspective as ${u.name} (${u.role}).`);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Test perspective as this role"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUserToDelete(u);
                                  setDeleteUserModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Remove user"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Permissions to Default?"
        message="This will restore the baseline permissions matrix. Any custom permission toggles for Managers and Specialists will be restored to defaults."
        confirmText="Yes, Reset Permissions"
        variant="warning"
      />

      {/* Confirmation Modal for Deleting User */}
      <ConfirmModal
        isOpen={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title="Remove User Account?"
        message={`Are you sure you want to remove user ${userToDelete?.name}? Their access credentials will be revoked.`}
        confirmText="Yes, Remove User"
        variant="danger"
      />

      {/* Modal: Add New User */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Register New User"
        subtitle="Create a new user account and assign an initial RBAC role"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5">
          <Input
            label="Full Name *"
            placeholder="e.g. David Miller"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            required
          />

          <Input
            label="Corporate Email *"
            type="email"
            placeholder="e.g. david.miller@enterprise.com"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Department"
              placeholder="e.g. Logistics"
              value={newUserData.department}
              onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
            />

            <Select
              label="Assigned Role *"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              options={[
                { value: ROLES.ADMIN, label: 'Admin (Director)' },
                { value: ROLES.MANAGER, label: 'Manager (Lead)' },
                { value: ROLES.EMPLOYEE, label: 'Employee (Specialist)' },
              ]}
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            💡 The newly registered user can log in with their email and password <code>Password123!</code>, or enroll their personal Windows Hello / Fingerprint passkey.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={UserPlus}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSettings;
