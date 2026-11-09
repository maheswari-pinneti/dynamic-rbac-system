/**
 * Human-Centric RBAC Constants, Personas, and Baseline Permission Matrix
 */

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

export const ROLE_HUMAN_TITLES = {
  [ROLES.ADMIN]: 'Executive Administrator',
  [ROLES.MANAGER]: 'Department Team Lead',
  [ROLES.EMPLOYEE]: 'Operations Specialist',
};

export const ROLE_LIST = [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE];

export const ROLE_BADGE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-600',
    humanLabel: 'Executive Administrator',
  },
  [ROLES.MANAGER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
    humanLabel: 'Team Manager',
  },
  [ROLES.EMPLOYEE]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
    humanLabel: 'Team Specialist',
  },
};

/**
 * All permission identifiers in the system
 */
export const PERMISSIONS = {
  // Core Module & Page Views
  DASHBOARD: 'dashboard.view',
  DASHBOARD_EXPORT: 'dashboard.export',
  ANALYTICS: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',
  VIEW_RECORDS: 'records.view',
  CREATE_RECORDS: 'records.create',
  EDIT_RECORDS: 'records.edit',
  DELETE_RECORDS: 'records.delete',
  RECORDS_EXPORT: 'records.export',
  REPORTS: 'reports.view',
  REPORTS_CREATE: 'reports.create',
  REPORTS_EXPORT: 'reports.export',
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_EXPORT: 'users.export',
  SETTINGS: 'settings.manage',
  PROFILE: 'profile.view',
  PROFILE_EDIT: 'profile.edit',

  // Granular Dynamic Dashboard Widget Permissions
  DASHBOARD_KPI_RECORDS: 'dashboard.kpi_records',
  DASHBOARD_KPI_USERS: 'dashboard.kpi_users',
  DASHBOARD_CHARTS: 'dashboard.charts',
  DASHBOARD_ACTIVITY: 'dashboard.activity',
  DASHBOARD_HEALTH: 'dashboard.health',
};

/**
 * Enterprise Module Matrix Definition
 * Columns: View, Create, Edit, Delete, Export
 */
export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Executive overview, widgets, metrics, and KPI cards',
    actions: {
      view: 'dashboard.view',
      export: 'dashboard.export',
    },
    widgets: [
      { key: 'dashboard.kpi_records', label: 'Catalog KPIs (Total, Active, Low Stock)' },
      { key: 'dashboard.kpi_users', label: 'Team KPIs (Managers, Staff, Roles)' },
      { key: 'dashboard.charts', label: 'Performance Analytics Charts' },
      { key: 'dashboard.activity', label: 'Live Audit Activity Trail' },
      { key: 'dashboard.health', label: 'Infrastructure & System Health' },
    ],
  },
  {
    id: 'users',
    name: 'Users',
    description: 'Team member directory, role assignments, and account security',
    actions: {
      view: 'users.view',
      create: 'users.create',
      edit: 'users.edit',
      delete: 'users.delete',
      export: 'users.export',
    },
  },
  {
    id: 'records',
    name: 'Records (Catalog)',
    description: 'Product merchandise, pricing, stock levels, and REST API records',
    actions: {
      view: 'records.view',
      create: 'records.create',
      edit: 'records.edit',
      delete: 'records.delete',
      export: 'records.export',
    },
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Visual charts, category distribution, and growth trends',
    actions: {
      view: 'analytics.view',
      export: 'analytics.export',
    },
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Inventory valuation, stock alert reports, and CSV spreadsheets',
    actions: {
      view: 'reports.view',
      create: 'reports.create',
      edit: 'reports.edit',
      export: 'reports.export',
    },
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Dynamic RBAC permission matrix and enterprise access policies',
    actions: {
      view: 'settings.manage',
      edit: 'settings.manage',
    },
    adminOnly: true,
  },
  {
    id: 'profile',
    name: 'Profile',
    description: 'Personal bio, security credentials, and WebAuthn Passkeys',
    actions: {
      view: 'profile.view',
      edit: 'profile.edit',
    },
  },
];

/**
 * Human-Friendly Permission Metadata
 */
export const PERMISSION_DEFINITIONS = [
  {
    key: PERMISSIONS.DASHBOARD,
    label: 'Overview Dashboard',
    humanQuestion: 'Can users with this role view the overview dashboard and metrics?',
    category: 'Team Workspace',
    description: 'Access summary cards, operational activities, and today’s metrics.',
    route: '/dashboard',
  },
  {
    key: PERMISSIONS.ANALYTICS,
    label: 'Visual Team Analytics',
    humanQuestion: 'Can users with this role inspect analytics and performance charts?',
    category: 'Insights & Health',
    description: 'Inspect category volume, monthly progress, and throughput charts.',
    route: '/analytics',
  },
  {
    key: PERMISSIONS.VIEW_RECORDS,
    label: 'Browse Catalog Records',
    humanQuestion: 'Can users with this role browse and search the product catalog?',
    category: 'Catalog Management',
    description: 'Search, filter, and view detailed specifications for all items.',
    route: '/products',
  },
  {
    key: PERMISSIONS.CREATE_RECORDS,
    label: 'Add New Products',
    humanQuestion: 'Can users with this role create and add new products to inventory?',
    category: 'Catalog Management',
    description: 'Register fresh products with pricing, stock levels, and descriptions.',
    action: 'create',
  },
  {
    key: PERMISSIONS.EDIT_RECORDS,
    label: 'Update Existing Products',
    humanQuestion: 'Can users with this role edit product details, prices, and stock?',
    category: 'Catalog Management',
    description: 'Modify specifications, adjust inventory counts, and update photos.',
    action: 'edit',
  },
  {
    key: PERMISSIONS.DELETE_RECORDS,
    label: 'Remove Products',
    humanQuestion: 'Can users with this role permanently delete products from inventory?',
    category: 'Catalog Management',
    description: 'Permanently remove obsolete records from the catalog.',
    action: 'delete',
  },
  {
    key: PERMISSIONS.REPORTS,
    label: 'Operational Reports',
    humanQuestion: 'Can users with this role view and export inventory reports?',
    category: 'Team Workspace',
    description: 'Review stock valuations and download spreadsheet CSV summaries.',
    route: '/reports',
  },
  {
    key: PERMISSIONS.SETTINGS,
    label: 'Admin Permission Settings',
    humanQuestion: 'Can users with this role configure dynamic role permissions and settings?',
    category: 'Governance & Security',
    description: 'Manage the dynamic permission matrix and govern role privileges.',
    route: '/admin/settings',
    adminRestricted: true,
  },
  {
    key: PERMISSIONS.PROFILE,
    label: 'Personal Identity & Passkeys',
    humanQuestion: 'Can users with this role view and update their profile and passkeys?',
    category: 'Personal Identity',
    description: 'Inspect personal bio, role privileges, and register Windows Hello / Fingerprints.',
    route: '/profile',
  },
];

/**
 * Default permission matrix as requested in Module 5 specifications
 */
export const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: {
    // Dashboard & Widgets
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.DASHBOARD_EXPORT]: true,
    [PERMISSIONS.DASHBOARD_KPI_RECORDS]: true,
    [PERMISSIONS.DASHBOARD_KPI_USERS]: true,
    [PERMISSIONS.DASHBOARD_CHARTS]: true,
    [PERMISSIONS.DASHBOARD_ACTIVITY]: true,
    [PERMISSIONS.DASHBOARD_HEALTH]: true,
    // Records
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: true,
    [PERMISSIONS.EDIT_RECORDS]: true,
    [PERMISSIONS.DELETE_RECORDS]: true,
    [PERMISSIONS.RECORDS_EXPORT]: true,
    // Analytics
    [PERMISSIONS.ANALYTICS]: true,
    [PERMISSIONS.ANALYTICS_EXPORT]: true,
    // Reports
    [PERMISSIONS.REPORTS]: true,
    [PERMISSIONS.REPORTS_CREATE]: true,
    [PERMISSIONS.REPORTS_EXPORT]: true,
    // Users
    [PERMISSIONS.USERS_VIEW]: true,
    [PERMISSIONS.USERS_CREATE]: true,
    [PERMISSIONS.USERS_EDIT]: true,
    [PERMISSIONS.USERS_DELETE]: true,
    [PERMISSIONS.USERS_EXPORT]: true,
    // Settings & Profile
    [PERMISSIONS.SETTINGS]: true,
    [PERMISSIONS.PROFILE]: true,
    [PERMISSIONS.PROFILE_EDIT]: true,
  },
  [ROLES.MANAGER]: {
    // Dashboard & Widgets
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.DASHBOARD_EXPORT]: true,
    [PERMISSIONS.DASHBOARD_KPI_RECORDS]: true,
    [PERMISSIONS.DASHBOARD_KPI_USERS]: true,
    [PERMISSIONS.DASHBOARD_CHARTS]: true,
    [PERMISSIONS.DASHBOARD_ACTIVITY]: true,
    [PERMISSIONS.DASHBOARD_HEALTH]: true,
    // Records
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: true,
    [PERMISSIONS.EDIT_RECORDS]: true,
    [PERMISSIONS.DELETE_RECORDS]: false,
    [PERMISSIONS.RECORDS_EXPORT]: true,
    // Analytics
    [PERMISSIONS.ANALYTICS]: true,
    [PERMISSIONS.ANALYTICS_EXPORT]: true,
    // Reports
    [PERMISSIONS.REPORTS]: true,
    [PERMISSIONS.REPORTS_CREATE]: true,
    [PERMISSIONS.REPORTS_EXPORT]: true,
    // Users
    [PERMISSIONS.USERS_VIEW]: true,
    [PERMISSIONS.USERS_CREATE]: false,
    [PERMISSIONS.USERS_EDIT]: false,
    [PERMISSIONS.USERS_DELETE]: false,
    [PERMISSIONS.USERS_EXPORT]: true,
    // Settings & Profile
    [PERMISSIONS.SETTINGS]: false,
    [PERMISSIONS.PROFILE]: true,
    [PERMISSIONS.PROFILE_EDIT]: true,
  },
  [ROLES.EMPLOYEE]: {
    // Dashboard & Widgets
    [PERMISSIONS.DASHBOARD]: true,
    [PERMISSIONS.DASHBOARD_EXPORT]: false,
    [PERMISSIONS.DASHBOARD_KPI_RECORDS]: true,
    [PERMISSIONS.DASHBOARD_KPI_USERS]: false,
    [PERMISSIONS.DASHBOARD_CHARTS]: false,
    [PERMISSIONS.DASHBOARD_ACTIVITY]: true,
    [PERMISSIONS.DASHBOARD_HEALTH]: false,
    // Records
    [PERMISSIONS.VIEW_RECORDS]: true,
    [PERMISSIONS.CREATE_RECORDS]: false,
    [PERMISSIONS.EDIT_RECORDS]: false,
    [PERMISSIONS.DELETE_RECORDS]: false,
    [PERMISSIONS.RECORDS_EXPORT]: false,
    // Analytics
    [PERMISSIONS.ANALYTICS]: false,
    [PERMISSIONS.ANALYTICS_EXPORT]: false,
    // Reports
    [PERMISSIONS.REPORTS]: false,
    [PERMISSIONS.REPORTS_CREATE]: false,
    [PERMISSIONS.REPORTS_EXPORT]: false,
    // Users
    [PERMISSIONS.USERS_VIEW]: false,
    [PERMISSIONS.USERS_CREATE]: false,
    [PERMISSIONS.USERS_EDIT]: false,
    [PERMISSIONS.USERS_DELETE]: false,
    [PERMISSIONS.USERS_EXPORT]: false,
    // Settings & Profile
    [PERMISSIONS.SETTINGS]: false,
    [PERMISSIONS.PROFILE]: true,
    [PERMISSIONS.PROFILE_EDIT]: true,
  },
};

/**
 * Real Human Team Personas with authentic human portraits and friendly bios
 */
export const DEMO_USERS = [
  {
    id: 'usr_admin_01',
    name: 'Sarah Connor',
    email: 'admin@enterprise.com',
    password: 'Password123!',
    role: ROLES.ADMIN,
    title: 'Lead Executive Administrator',
    department: 'People Operations & Security',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Oversees organizational policy, staff privileges, and team operations.',
    statusMessage: 'Coordinating team permission policies',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_sarah_hello',
        name: 'Sarah’s Windows Hello (Facial & PIN)',
        type: 'platform',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
    ],
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_manager_02',
    name: 'Marcus Vance',
    email: 'manager@enterprise.com',
    password: 'Password123!',
    role: ROLES.MANAGER,
    title: 'Senior Product Lead',
    department: 'Product Logistics & Supply',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Leads product curation, reviews team contributions, and manages catalog inventory.',
    statusMessage: 'Reviewing quarterly supplier shipments',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_marcus_fp',
        name: 'Marcus’s Fingerprint Sensor',
        type: 'platform',
        createdAt: '2026-02-10T10:30:00.000Z',
      },
    ],
    createdAt: '2026-02-10T10:30:00.000Z',
  },
  {
    id: 'usr_employee_03',
    name: 'Elena Rostova',
    email: 'employee@enterprise.com',
    password: 'Password123!',
    role: ROLES.EMPLOYEE,
    title: 'Operations Specialist',
    department: 'Customer Fulfillment & Catalog',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Coordinates day-to-day order fulfillments and keeps catalog specifications up to date.',
    statusMessage: 'Auditing current in-stock goods',
    online: true,
    hasPasskey: true,
    passkeys: [
      {
        id: 'pk_elena_touch',
        name: 'Elena’s Device Biometrics',
        type: 'platform',
        createdAt: '2026-03-01T09:15:00.000Z',
      },
    ],
    createdAt: '2026-03-01T09:15:00.000Z',
  },
];
