import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  ChevronRight,
  Layers,
  Activity,
  History,
  TrendingUp,
  Server,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Crown,
  Briefcase,
  Compass,
  ArrowRight,
  Eye,
  Star,
  PackageCheck,
  ClipboardList,
  Maximize2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProduct } from '../../context/ProductContext';
import { usePermission } from '../../context/PermissionContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import { formatCurrency, formatNumber, timeAgo } from '../../utils/formatters';
import ChartPreviewModal from '../../components/common/ChartPreviewModal';

export const Dashboard = () => {
  const { allProducts } = useProduct();
  const { currentUser, users, loginHistory, switchRole } = useAuth();
  const { activityLogs } = usePermission();
  const { isDark } = useTheme();

  // Active role
  const userRole = currentUser?.role || ROLES.ADMIN;

  // Active KPI Filter State (for Admin view)
  const [selectedKpi, setSelectedKpi] = useState(null);
  // Interactive Chart Preview Modal State
  const [previewChart, setPreviewChart] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenChartPreview = (config) => {
    setPreviewChart(config);
    setIsPreviewOpen(true);
  };


  // Dynamic Theme Colors for Charts
  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs';

  // Dynamic Counts based on PRD
  const totalRecords = allProducts?.length || 194;
  const totalActiveRecords = useMemo(
    () => (allProducts || []).filter((p) => (p.stock ?? 15) > 10).length || 168,
    [allProducts]
  );
  const totalInactiveRecords = useMemo(
    () => (allProducts || []).filter((p) => (p.stock ?? 15) <= 10).length || 26,
    [allProducts]
  );
  const totalManagers = useMemo(
    () => (users || []).filter((u) => u.role === 'Manager').length || 4,
    [users]
  );
  const totalEmployees = useMemo(
    () => (users || []).filter((u) => u.role === 'Employee').length || 12,
    [users]
  );
  const totalRoles = 3;
  const recentActivitiesCount = (activityLogs || []).length || 48;
  const newRecordsThisMonth = Math.round(totalRecords * 0.18) + 4;

  // ==========================================================
  // SHARED CHART DATA SETS
  // ==========================================================


  // Chart 1: Line Chart Data (Monthly Growth)
  const lineChartMonthlyGrowth = [
    { month: 'Feb', records: 125, active: 108 },
    { month: 'Mar', records: 142, active: 124 },
    { month: 'Apr', records: 156, active: 138 },
    { month: 'May', records: 170, active: 150 },
    { month: 'Jun', records: 182, active: 160 },
    { month: 'Jul', records: 194, active: 168 },
  ];

  // Chart 2: Bar Chart Data (Record Distribution across Categories)
  const barChartRecordDistribution = [
    { name: 'Beauty', count: 42 },
    { name: 'Furniture', count: 35 },
    { name: 'Fragrances', count: 28 },
    { name: 'Groceries', count: 24 },
    { name: 'Laptops', count: 18 },
    { name: 'Phones', count: 15 },
  ];

  // Chart 3: Pie Chart Data (Status Distribution - True solid Pie)
  const pieChartStatusDistribution = [
    { name: 'In-Stock Ready', value: Math.max(1, totalActiveRecords), color: '#10b981' },
    { name: 'Low Inventory', value: Math.max(1, totalInactiveRecords > 4 ? totalInactiveRecords - 4 : totalInactiveRecords), color: '#f59e0b' },
    { name: 'Out of Stock', value: Math.max(1, Math.min(totalInactiveRecords, 4)), color: '#ef4444' },
  ];

  // Chart 4: Donut Chart Data (Activity Trend & Category Share)
  const donutChartCategoryShare = [
    { name: 'Beauty & Skin', value: 35, amount: '₹48,500', color: '#2563eb' },
    { name: 'Home & Living', value: 25, amount: '₹34,200', color: '#f59e0b' },
    { name: 'Fragrances', value: 22, amount: '₹30,100', color: '#10b981' },
    { name: 'Groceries', value: 18, amount: '₹24,800', color: '#8b5cf6' },
  ];

  // Employee Weekly Activity Data
  const employeeWeeklyActivity = [
    { day: 'Mon', completed: 14, target: 15 },
    { day: 'Tue', completed: 16, target: 15 },
    { day: 'Wed', completed: 12, target: 15 },
    { day: 'Thu', completed: 15, target: 15 },
    { day: 'Fri', completed: 18, target: 15 },
    { day: 'Sat', completed: 11, target: 15 },
  ];

  // ==========================================================
  // CHART PREVIEW CONFIGURATIONS
  // ==========================================================
  const adminMonthlyGrowthConfig = {
    title: 'Monthly Catalog Growth',
    subtitle: '6-Month historical catalog trajectory vs. in-stock fulfillment',
    type: 'line',
    icon: LineIcon,
    badge: '+18.4% MoM',
    data: lineChartMonthlyGrowth,
    xAxisKey: 'month',
    series: [
      { key: 'records', name: 'Total Records', color: '#2563eb', strokeWidth: 3 },
      { key: 'active', name: 'In-Stock Units', color: '#10b981', strokeWidth: 2.5, dashed: true },
    ],
    metrics: [
      { label: 'Current Total Records', value: '194', change: '+18.4%', isPositive: true },
      { label: 'In-Stock Ready Units', value: '168', change: '86.6% Rate', isPositive: true },
      { label: '6-Month Net Growth', value: '+69 Items', change: '+55.2%', isPositive: true },
      { label: 'Peak Velocity Month', value: 'Jul 2026', change: 'Current', isPositive: true },
    ],
  };

  const adminRecordDistributionConfig = {
    title: 'Record Distribution by Category',
    subtitle: 'Live item count breakdown across top catalog sectors',
    type: 'bar',
    icon: BarChart3,
    badge: '24 Sectors',
    data: barChartRecordDistribution,
    xAxisKey: 'name',
    series: [
      { key: 'count', name: 'Items in Sector', color: '#0d9488' },
    ],
    metrics: [
      { label: 'Lead Product Sector', value: 'Beauty (42)', change: '25.9% Share', isPositive: true },
      { label: 'Second Sector', value: 'Furniture (35)', change: '21.6% Share', isPositive: true },
      { label: 'Average Items / Sector', value: '27 Items', change: 'Balanced', isPositive: true },
      { label: 'Active Monitored SKUs', value: '162 Units', change: '100% Synced', isPositive: true },
    ],
  };

  const adminStatusDistributionConfig = {
    title: 'Inventory Status Distribution',
    subtitle: 'Stock buffer evaluation and replenishment thresholds',
    type: 'pie',
    icon: PieIcon,
    badge: '86% In-Stock',
    data: pieChartStatusDistribution,
    metrics: [
      { label: 'In-Stock Ready', value: '168 SKUs', change: '86% Healthy', isPositive: true },
      { label: 'Low Stock Priority', value: '22 SKUs', change: '11% Reorder', isPositive: false },
      { label: 'Critical Outage Alert', value: '4 SKUs', change: 'Action Required', isPositive: false },
      { label: 'Fulfillment Index', value: '96.8%', change: '+1.2%', isPositive: true },
    ],
  };

  const adminCategoryShareConfig = {
    title: 'Category Valuation Share',
    subtitle: 'Financial and asset contribution by product category',
    type: 'donut',
    icon: Boxes,
    centerLabel: 'Valuation',
    badge: '₹1,48,250 Total',
    data: donutChartCategoryShare,
    metrics: [
      { label: 'Beauty Division', value: '₹38,500', change: '26% Total', isPositive: true },
      { label: 'Furniture Sector', value: '₹32,600', change: '22% Total', isPositive: true },
      { label: 'Fragrances & FMCG', value: '₹26,100', change: '18% Total', isPositive: true },
      { label: 'Consumer Electronics', value: '₹51,050', change: '34% Total', isPositive: true },
    ],
  };

  const managerGrowthConfig = {
    title: 'Inventory Expansion Velocity',
    subtitle: 'Operational stock replenishment velocity vs target commitments',
    type: 'line',
    icon: LineIcon,
    badge: '+18.4% MoM',
    data: lineChartMonthlyGrowth,
    xAxisKey: 'month',
    series: [
      { key: 'records', name: 'Catalog Target', color: '#2563eb', strokeWidth: 3 },
      { key: 'active', name: 'In-Stock Units', color: '#10b981', strokeWidth: 2 },
    ],
    metrics: [
      { label: 'Target Trajectory', value: '194 SKUs', change: 'On Track', isPositive: true },
      { label: 'Fulfillment Rate', value: '86.6%', change: '+2.4%', isPositive: true },
      { label: 'Lead Velocity', value: '168 Units', change: 'Stable', isPositive: true },
      { label: 'Audit Compliance', value: '100%', change: 'Enforced', isPositive: true },
    ],
  };

  const managerVolumeConfig = {
    title: 'Category Stock Volume',
    subtitle: 'Current unit allocations across top departmental warehouses',
    type: 'bar',
    icon: BarChart3,
    badge: '24 Sectors',
    data: barChartRecordDistribution,
    xAxisKey: 'name',
    series: [
      { key: 'count', name: 'Stock Count', color: '#0284c7' },
    ],
    metrics: [
      { label: 'Lead Department', value: 'Beauty (42)', change: 'High Flow', isPositive: true },
      { label: 'Home & Living', value: 'Furniture (35)', change: 'Moderate', isPositive: true },
      { label: 'Average Restock Pace', value: '3.2 Days', change: 'Fast', isPositive: true },
      { label: 'Department Coverage', value: '24 Active', change: '100%', isPositive: true },
    ],
  };

  const managerBufferConfig = {
    title: 'Stock Buffer Health Ratio',
    subtitle: 'Tiered stock safety margin evaluation across catalog',
    type: 'pie',
    icon: PieIcon,
    badge: '86% Healthy',
    data: pieChartStatusDistribution,
    metrics: [
      { label: 'Safe In-Stock Buffer', value: '168 SKUs', change: '86% Ratio', isPositive: true },
      { label: 'Low Stock Buffer', value: '22 SKUs', change: 'Reorder Sent', isPositive: false },
      { label: 'Immediate Stockout', value: '4 SKUs', change: 'PO Dispatched', isPositive: false },
      { label: 'Service Level Agreement', value: '99.1%', change: 'Target Met', isPositive: true },
    ],
  };

  const employeeThroughputConfig = {
    title: 'My Daily Curation Throughput',
    subtitle: 'Individual item curation and quality audit throughput vs daily target',
    type: 'bar',
    icon: BarChart3,
    badge: 'Target: 15 / Day',
    data: employeeWeeklyActivity,
    xAxisKey: 'day',
    series: [
      { key: 'completed', name: 'Completed Updates', color: '#2563eb' },
      { key: 'target', name: 'Daily Target', color: isDark ? '#475569' : '#cbd5e1' },
    ],
    metrics: [
      { label: 'Total Completed This Week', value: '83 Items', change: '+10.6%', isPositive: true },
      { label: 'Weekly Target', value: '75 Items', change: 'Exceeded', isPositive: true },
      { label: 'Average Per Day', value: '16.6 Items', change: 'Above Target', isPositive: true },
      { label: 'Accuracy Rating', value: '99.4%', change: 'Top Tier', isPositive: true },
    ],
  };

  const employeeDemandConfig = {
    title: 'Top Demand Product Sectors',
    subtitle: 'High volume curation categories requiring active staff attention',
    type: 'donut',
    icon: Boxes,
    centerLabel: 'Demand',
    badge: 'Live Demand',
    data: donutChartCategoryShare,
    metrics: [
      { label: 'Fastest-Moving', value: 'Beauty & Skin', change: '35% Volume', isPositive: true },
      { label: 'Second Priority', value: 'Furniture Living', change: '25% Volume', isPositive: true },
      { label: 'Daily Review Queue', value: '18 Items', change: 'Assigned', isPositive: true },
      { label: 'Catalog Freshness', value: '4.8 Hours', change: 'Real-time', isPositive: true },
    ],
  };




  // Recent Activities
  const recentActivities = [
    { id: 'act_1', user: 'Sarah Connor (Admin)', action: 'Updated dynamic permissions for Manager role in Matrix', time: 'Just now', role: 'Admin' },
    { id: 'act_2', user: 'Marcus Vance (Manager)', action: 'Updated inventory buffer for Essence Mascara Lash', time: '12 mins ago', role: 'Manager' },
    { id: 'act_3', user: 'Elena Rostova (Employee)', action: 'Created new product record "Wireless Earbuds"', time: '1 hour ago', role: 'Employee' },
    { id: 'act_4', user: 'System Security Engine', action: 'Daily database backup and catalog verification completed safely', time: '2 hours ago', role: 'System' },
    { id: 'act_5', user: 'Sarah Connor (Admin)', action: 'Authenticated via Windows Hello Biometric Passkey', time: '3 hours ago', role: 'Admin' },
  ];

  // Top Categories (DummyJSON API)
  const topCategories = [
    { name: 'Beauty & Personal Care', count: '42 Products', percent: 85, color: 'bg-blue-600' },
    { name: 'Furniture & Decor', count: '35 Products', percent: 68, color: 'bg-emerald-500' },
    { name: 'Fragrances & Perfumes', count: '28 Products', percent: 52, color: 'bg-amber-500' },
    { name: 'Groceries & Essentials', count: '24 Products', percent: 42, color: 'bg-cyan-500' },
    { name: 'Laptops & Technology', count: '18 Products', percent: 30, color: 'bg-pink-500' },
  ];

  // Low Stock Items for Manager
  const lowStockProducts = (allProducts || [])
    .filter((p) => (p.stock ?? 15) <= 10)
    .slice(0, 5);

  // Spotlight Products for Employee
  const spotlightProducts = (allProducts || []).slice(0, 5);

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const headerLabel = label || payload[0]?.payload?.name || payload[0]?.name;
      return (
        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl border border-slate-700 min-w-[130px]">
          {headerLabel && (
            <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
              {headerLabel}
            </p>
          )}
          {payload.map((entry, index) => {
            const entryName = entry.name || entry.payload?.name || 'Count';
            const entryValue = entry.value !== undefined ? entry.value : entry.payload?.value;
            const entryColor = entry.color || entry.fill || entry.payload?.fill || '#3b82f6';
            return (
              <p key={`entry-${index}`} className="mt-1 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entryColor }} />
                  <span>{entryName}:</span>
                </span>
                <span className="font-bold font-mono text-white">{entryValue}</span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // ==========================================================
  // ADMIN 8 SUMMARY CARDS DEFINITIONS
  // ==========================================================
  const adminKpiCards = [
    {
      id: 'total-records',
      label: 'Total Records',
      value: `${totalRecords} Items`,
      trend: '12.8%',
      trendText: 'vs Last Month',
      icon: Boxes,
      gradient: 'from-[#6366f1] via-[#7c3aed] to-[#8b5cf6]',
      description: 'Total active catalog merchandise managed and curated across the enterprise repository.',
      metrics: [
        { label: 'REST API Source', value: 'DummyJSON API' },
        { label: 'Stock Valuation', value: '₹1,48,250.00' },
        { label: 'Categories Active', value: '24 Sectors' },
        { label: 'Sync Status', value: '100% Up to Date' },
      ],
    },
    {
      id: 'active-records',
      label: 'Total Active Records',
      value: `${totalActiveRecords} In-Stock`,
      trend: '18.6%',
      trendText: 'Dispatch Ready',
      icon: CheckCircle2,
      gradient: 'from-[#059669] via-[#10b981] to-[#34d399]',
      description: 'Catalog products maintaining safe inventory buffers (>10 units) available for immediate shipment.',
      metrics: [
        { label: 'Dispatch Buffer', value: '> 10 Safe Units' },
        { label: 'Fulfillment Rate', value: '98.4% SLA' },
        { label: 'Average Restock', value: '45 Units' },
        { label: 'Quality Check', value: 'Verified 100%' },
      ],
    },
    {
      id: 'inactive-records',
      label: 'Total Inactive Records',
      value: `${totalInactiveRecords} Low Stock`,
      trend: '10.4%',
      trendText: 'Restock Priority',
      icon: AlertTriangle,
      gradient: 'from-[#f59e0b] via-[#f97316] to-[#ea580c]',
      description: 'Products that have fallen below safety inventory buffers (≤10 units) requiring purchase reorders.',
      metrics: [
        { label: 'Critical Outages', value: '4 Zero Stock' },
        { label: 'Reorder Pipeline', value: '₹12,450.00' },
        { label: 'Supplier Lead', value: '3-5 Business Days' },
        { label: 'Priority Level', value: 'High Priority' },
      ],
    },
    {
      id: 'total-managers',
      label: 'Total Managers',
      value: `${totalManagers} Managers`,
      trend: 'Team Leads',
      trendText: 'Department Leads',
      icon: Users,
      gradient: 'from-[#2563eb] via-[#0284c7] to-[#0ea5e9]',
      description: 'Supervisory managers with catalog editing, analytics review, and report generation authority.',
      metrics: [
        { label: 'Assigned Supervisors', value: 'Product & Logistics' },
        { label: 'Catalog Approvals', value: '28 Items Cleared' },
        { label: 'Active Sessions', value: '4 Online Today' },
        { label: 'Access Tier', value: 'Configurable RBAC' },
      ],
    },
    {
      id: 'total-employees',
      label: 'Total Employees',
      value: `${totalEmployees} Specialists`,
      trend: 'Operations',
      trendText: 'Fulfillment Staff',
      icon: UserCheck,
      gradient: 'from-[#db2777] via-[#ec4899] to-[#f43f5e]',
      description: 'Frontline operations staff coordinating day-to-day catalog updates and customer fulfillment.',
      metrics: [
        { label: 'Daily Entries', value: '64 Updates' },
        { label: 'Active Curators', value: '12 Specialists' },
        { label: 'Passkey Enrolled', value: '100% Biometrics' },
        { label: 'Role Governance', value: 'Employee Tier' },
      ],
    },
    {
      id: 'total-roles',
      label: 'Total Roles',
      value: `${totalRoles} RBAC Roles`,
      trend: 'Active',
      trendText: 'Admin • Mgr • Emp',
      icon: ShieldCheck,
      gradient: 'from-[#7c3aed] via-[#8b5cf6] to-[#a855f7]',
      description: 'Three-tiered Dynamic Role-Based Access Control matrix configured and enforced at runtime.',
      metrics: [
        { label: 'Super Admin', value: 'Full Governance' },
        { label: 'Manager Tier', value: 'Operational Access' },
        { label: 'Employee Tier', value: 'Task Bound' },
        { label: 'Permission Engine', value: 'Dynamic Matrix' },
      ],
    },
    {
      id: 'recent-activities',
      label: 'Recent Activities',
      value: `${recentActivitiesCount} Operations`,
      trend: 'Live Trail',
      trendText: 'Audit Log Active',
      icon: Sparkles,
      gradient: 'from-[#0d9488] via-[#14b8a6] to-[#06b6d4]',
      description: 'Every CRUD operation, permission update, and authentication event stamped with identity & timestamp.',
      metrics: [
        { label: 'CRUD Dispatches', value: '142 Calls' },
        { label: 'Security Logins', value: '38 Sessions' },
        { label: 'Permission Changes', value: 'Real-Time Immediate' },
        { label: 'Compliance Audit', value: '100% Captured' },
      ],
    },
    {
      id: 'new-records',
      label: 'New Records (Month)',
      value: `${newRecordsThisMonth} Additions`,
      trend: '18.2%',
      trendText: 'Catalog Growth',
      icon: ShoppingBag,
      gradient: 'from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]',
      description: 'Newly introduced merchandise added to our central enterprise catalog this monthly cycle.',
      metrics: [
        { label: 'Top Growth Sector', value: 'Smart Home & Tech' },
        { label: 'Average Price', value: '₹84.50' },
        { label: 'Average Rating', value: '4.7 ★ / 5.0' },
        { label: 'Review Status', value: 'Approved & Listed' },
      ],
    },
  ];

  // ==========================================================
  // MANAGER 6 OPERATIONAL KPI CARDS
  // ==========================================================
  const managerKpiCards = [
    {
      label: 'Catalog Items',
      value: `${totalRecords} Items`,
      trend: '+12.8%',
      trendText: 'In Central Catalog',
      icon: Boxes,
      gradient: 'from-[#2563eb] to-[#3b82f6]',
    },
    {
      label: 'Safe In-Stock Stock',
      value: `${totalActiveRecords} Units`,
      trend: '98.4%',
      trendText: 'Fulfillment Ready',
      icon: CheckCircle2,
      gradient: 'from-[#059669] to-[#10b981]',
    },
    {
      label: 'Restock Alerts',
      value: `${totalInactiveRecords} Items`,
      trend: 'Action Required',
      trendText: 'Low Stock Buffer',
      icon: AlertTriangle,
      gradient: 'from-[#ea580c] to-[#f97316]',
    },
    {
      label: 'Team Specialists',
      value: `${totalEmployees} Active`,
      trend: 'Staff',
      trendText: 'Operations Staff',
      icon: Users,
      gradient: 'from-[#7c3aed] to-[#8b5cf6]',
    },
    {
      label: 'Monthly Growth',
      value: `+${newRecordsThisMonth} Added`,
      trend: '+18.2%',
      trendText: 'New Catalog SKUs',
      icon: TrendingUp,
      gradient: 'from-[#0d9488] to-[#14b8a6]',
    },
    {
      label: 'Team Operations',
      value: `${recentActivitiesCount} Today`,
      trend: 'Active',
      trendText: 'Dispatched Tasks',
      icon: Activity,
      gradient: 'from-[#db2777] to-[#ec4899]',
    },
  ];

  // ==========================================================
  // EMPLOYEE 4 FRONTLINE KPI CARDS
  // ==========================================================
  const employeeKpiCards = [
    {
      label: 'Catalog Records',
      value: `${totalRecords} Products`,
      trend: 'Active',
      trendText: 'Available to Browse',
      icon: Boxes,
      gradient: 'from-[#2563eb] to-[#0284c7]',
    },
    {
      label: 'In-Stock Units',
      value: `${totalActiveRecords} Items`,
      trend: 'Ready',
      trendText: 'Dispatch Orders',
      icon: PackageCheck,
      gradient: 'from-[#059669] to-[#10b981]',
    },
    {
      label: 'Active Categories',
      value: '24 Sectors',
      trend: 'Curated',
      trendText: 'Top Demand Sectors',
      icon: Layers,
      gradient: 'from-[#7c3aed] to-[#a855f7]',
    },
    {
      label: 'My Daily Target',
      value: '12 / 15 Done',
      trend: '80%',
      trendText: 'Updates Completed',
      icon: ClipboardList,
      gradient: 'from-[#d97706] to-[#f59e0b]',
    },
  ];

  // Active card details for Admin filtering
  const activeCardInfo = adminKpiCards.find((c) => c.id === selectedKpi);

  const handleCardClick = (card) => {
    if (selectedKpi === card.id) {
      setSelectedKpi(null);
    } else {
      setSelectedKpi(card.id);
    }
  };

  // Role metadata helper
  const roleMetadata = {
    [ROLES.ADMIN]: {
      title: 'Executive Administrator Dashboard',
      subtitle: 'Complete organizational governance, runtime RBAC matrix enforcement, and full infrastructure health oversight.',
      badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      icon: Crown,
      iconBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    },
    [ROLES.MANAGER]: {
      title: 'Operations & Inventory Management Dashboard',
      subtitle: 'Supervisory catalog management, supply chain restock thresholds, team throughput, and category allocation.',
      badge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: Briefcase,
      iconBg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    },
    [ROLES.EMPLOYEE]: {
      title: 'Frontline Operations & Catalog Workspace',
      subtitle: 'Product catalog search, stock status verification, customer review inspection, and daily curation tasks.',
      badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: Compass,
      iconBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    },
  };

  const currentRoleMeta = roleMetadata[userRole] || roleMetadata[ROLES.ADMIN];
  const RoleIcon = currentRoleMeta.icon;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ========================================================
          ROLE PERSPECTIVE BANNER & 1-CLICK ROLE SWITCHER
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#091124] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${currentRoleMeta.iconBg} text-white shadow-sm flex-shrink-0`}>
            <RoleIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentRoleMeta.title}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleMeta.badge}`}>
                {userRole} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentRoleMeta.subtitle}
            </p>
          </div>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs flex-shrink-0">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-2 hidden md:inline">
            Active Role:
          </span>
          {[ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => switchRole(role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                userRole === role
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          VIEW 1: ADMIN DASHBOARD (EXECUTIVE & GOVERNANCE VIEW)
          ======================================================== */}
      {userRole === ROLES.ADMIN && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          {/* Admin 8 Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3">
            {adminKpiCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedKpi === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${card.gradient} p-3.5 text-white shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-lg ${
                    isSelected
                      ? 'ring-4 ring-white/90 dark:ring-blue-400 scale-[1.02]'
                      : selectedKpi
                      ? 'opacity-65 hover:opacity-100'
                      : ''
                  }`}
                >
                  <svg
                    className="absolute bottom-0 left-0 right-0 w-full h-10 opacity-30 pointer-events-none"
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,45 Q30,20 60,35 T120,25 T180,40 T200,30 L200,60 L0,60 Z"
                      fill="currentColor"
                    />
                    <path
                      d="M0,45 Q30,20 60,35 T120,25 T180,40 T200,30"
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2.5"
                    />
                  </svg>

                  <div className="flex items-start justify-between relative z-10">
                    <span className="text-[11px] font-bold text-white/90 tracking-tight leading-tight truncate">
                      {card.label}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="mt-2 relative z-10">
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight truncate leading-tight">
                      {card.value}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-white/90">
                      <span className="inline-flex items-center gap-0.5 bg-black/15 px-1 py-0.2 rounded text-[9px]">
                        ▲ {card.trend}
                      </span>
                      <span className="text-[9px] text-white/80 truncate">{card.trendText}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Metric focus view when KPI card is clicked */}
          {selectedKpi && activeCardInfo && (
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activeCardInfo.gradient} text-white shadow-sm`}>
                    {React.createElement(activeCardInfo.icon, { className: 'w-5 h-5 text-white' })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {activeCardInfo.label} — Metric Focus View
                      </h4>
                      <span className="text-xs font-bold text-white bg-blue-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {activeCardInfo.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {activeCardInfo.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedKpi(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Show All Sections</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {activeCardInfo.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin 4 Core Recharts Engine */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Performance & Catalog Analytics
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Live Analytics
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {/* Line Chart */}
              <div
                onClick={() => handleOpenChartPreview(adminMonthlyGrowthConfig)}
                className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
                title="Click chart to preview and inspect details"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <LineIcon className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Monthly Growth (Line Chart)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      +18.4%
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartMonthlyGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Line type="monotone" dataKey="records" name="Total Records" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="active" name="In-Stock" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>6-Month Trajectory</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">194 Current</span>
                </div>
              </div>

              {/* Bar Chart */}
              <div
                onClick={() => handleOpenChartPreview(adminRecordDistributionConfig)}
                className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
                title="Click chart to preview and inspect details"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Record Distribution (Bar Chart)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300">Top Sectors</span>
                    <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartRecordDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Bar dataKey="count" name="Items" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Category Volume</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">24 Active</span>
                </div>
              </div>

              {/* Pie Chart */}
              <div
                onClick={() => handleOpenChartPreview(adminStatusDistributionConfig)}
                className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
                title="Click chart to preview and inspect details"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <PieIcon className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Status Distribution (Pie Chart)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300">Inventory</span>
                    <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full flex items-center justify-center pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartStatusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={68}
                        dataKey="value"
                      >
                        {pieChartStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-pie-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ready 86%
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Low 11%
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Out 3%
                  </span>
                </div>
              </div>

              {/* Donut Chart */}
              <div
                onClick={() => handleOpenChartPreview(adminCategoryShareConfig)}
                className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
                title="Click chart to preview and inspect details"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-purple-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Category Share (Donut Chart)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300">Valuation</span>
                    <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="relative h-48 w-full flex items-center justify-center pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutChartCategoryShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {donutChartCategoryShare.map((entry, index) => (
                          <Cell key={`cell-donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Catalog Share</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">₹1,48,250 Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Analytics & System Statistics */}
          <div className="grid grid-cols-12 gap-3.5">
            <div className={`col-span-12 xl:col-span-6 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Growth Analytics & Performance Velocity
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Healthy Pace
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Monthly Growth</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">+18.4%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">MoM Expansion</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Fulfillment SLA</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">98.2%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">Instant Dispatch</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Catalog Target</span>
                  <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 block mt-0.5">250 Items</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">77.6% Achieved</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Restock Buffer</span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">86.7%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">Safe Thresholds</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                Operational trajectory remains healthy across all 24 DummyJSON catalog departments. Inventory turn velocity is outpacing quarterly stock depletion forecasts by +4.8%.
              </p>
            </div>

            <div className={`col-span-12 xl:col-span-6 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    System Statistics & Infrastructure Health
                  </h4>
                </div>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                  All Systems Operational
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">REST API Status</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">200 OK</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">DummyJSON Live</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Cache Hit Rate</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">94.6%</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">Local Storage Sync</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Response Latency</span>
                  <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 block mt-0.5">48 ms</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">Axios Client</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">RBAC Enforcement</span>
                  <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400 block mt-0.5">9 Matrix Rules</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5 block">Context Runtime</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Security Engine: Passkey & Password Encrypted</span>
                <Link to="/admin/settings" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Configure Permission Matrix &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Top Categories & Recent Activities */}
          <div className="grid grid-cols-12 gap-3.5">
            <div className={`col-span-12 xl:col-span-6 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Top Categories (Based on DummyJSON API)
                  </h4>
                </div>
                <Link to="/products" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All 24 Sectors &rarr;
                </Link>
              </div>

              <div className="space-y-3 py-2 flex-1">
                {topCategories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white font-mono">{cat.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>24 Total Categories Curated</span>
                <span className="text-emerald-500 font-bold">100% Synced with Backend</span>
              </div>
            </div>

            <div className={`col-span-12 xl:col-span-6 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Recent Activities (Audit Trail)
                  </h4>
                </div>
                <Link to="/reports" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View Audit Report &rarr;
                </Link>
              </div>

              <div className="space-y-2.5 py-1.5 flex-1">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block text-[11px]">{act.user}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">{act.action}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-400 block font-mono">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Real-time Audit Log Tracking</span>
                <span className="text-blue-500 font-bold">Compliance Active</span>
              </div>
            </div>
          </div>



      {/* Full Recent Login History Table */}
          <div className={`rounded-2xl border ${cardBg} p-4 sm:p-5`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Recent Login History & Session Security Logs
                </h4>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Session Audit Trail
                </span>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing Last Authenticated Sessions
              </span>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="pb-2.5">User</th>
                    <th className="pb-2.5">Assigned Role</th>
                    <th className="pb-2.5">Auth Method</th>
                    <th className="pb-2.5">Client & IP Address</th>
                    <th className="pb-2.5">Timestamp</th>
                    <th className="pb-2.5 text-right">Access Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {(loginHistory || []).slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                        <div>{log.userName}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">{log.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {log.method}
                      </td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-300 font-mono text-[11px]">
                        {log.ipAddress || '127.0.0.1 (Local Client)'}
                      </td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-300 text-[11px] font-mono">
                        {timeAgo(log.timestamp)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.status.includes('Success')
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: MANAGER DASHBOARD (OPERATIONS & INVENTORY FOCUS)
          ======================================================== */}
      {userRole === ROLES.MANAGER && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          {/* Manager 6 Operational KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {managerKpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl bg-gradient-to-r ${card.gradient} p-4 text-white shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/90 truncate">
                      {card.label}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black mt-2 truncate">{card.value}</h3>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-white/90">
                    <span className="bg-black/20 px-1 py-0.2 rounded font-bold">
                      {card.trend}
                    </span>
                    <span className="truncate opacity-80">{card.trendText}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manager Analytics Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Monthly Growth Line Chart */}
            <div
              onClick={() => handleOpenChartPreview(managerGrowthConfig)}
              className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              title="Click chart to preview and inspect details"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Inventory Expansion Velocity
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-500 font-bold">+18.4% MoM</span>
                  <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                </div>
              </div>
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartMonthlyGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Line type="monotone" dataKey="records" name="Catalog Target" stroke="#2563eb" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="active" name="In-Stock" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Comparing Catalog Capacity vs Active Stock
              </span>
            </div>

            {/* Category Volume Bar Chart */}
            <div
              onClick={() => handleOpenChartPreview(managerVolumeConfig)}
              className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              title="Click chart to preview and inspect details"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Category Stock Volume
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-blue-500 font-bold">24 Active</span>
                  <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                </div>
              </div>
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartRecordDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar dataKey="count" name="Stock Count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Lead Departments: Beauty & Furniture
              </span>
            </div>

            {/* Inventory Health Pie Chart */}
            <div
              onClick={() => handleOpenChartPreview(managerBufferConfig)}
              className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              title="Click chart to preview and inspect details"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Stock Buffer Ratio
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-500 font-bold">86% Healthy</span>
                  <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                </div>
              </div>
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartStatusDistribution} cx="50%" cy="50%" outerRadius={55} dataKey="value">
                      {pieChartStatusDistribution.map((entry, index) => (
                        <Cell key={`pie-mgr-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-emerald-500 font-bold">● In-Stock: 168</span>
                <span className="text-amber-500 font-bold">● Low: 22</span>
                <span className="text-rose-500 font-bold">● Out: 4</span>
              </div>
            </div>
          </div>

          {/* Low Stock Alert Table & Stock Summary Card */}
          <div className="grid grid-cols-12 gap-3.5">
            {/* Low Stock Alert Table */}
            <div className={`col-span-12 xl:col-span-7 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Low Stock Priority Alert ({totalInactiveRecords} Items Requiring Reorder)
                  </h4>
                </div>
                <Link to="/products" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Open Catalog &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto py-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-2">Product Title</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Units Left</th>
                      <th className="pb-2 text-right">Priority Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {lowStockProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-2 font-bold text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
                          {p.title}
                        </td>
                        <td className="py-2 text-slate-500 dark:text-slate-300 capitalize">{p.category}</td>
                        <td className="py-2 font-mono font-bold text-rose-600 dark:text-rose-400">
                          {p.stock} units
                        </td>
                        <td className="py-2 text-right">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              p.stock <= 3
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {p.stock <= 3 ? 'Critical Outage' : 'Low Buffer'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Immediate restock purchase orders ready to dispatch</span>
                <span className="text-rose-500 font-bold">PO Pipeline Active</span>
              </div>
            </div>

            {/* Stock Summary Card */}
            <div className={`col-span-12 xl:col-span-5 rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Stock Summary & Valuation
                  </h4>
                </div>
                <Link to="/reports" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Reports &rarr;
                </Link>
              </div>

              <div className="space-y-2.5 py-2">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-300">Total Catalog Items</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">194 SKUs</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-300">Total Net Inventory Value</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹1,48,250.00</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-300">Reorder Budget Required</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">₹1,48,250.00</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-300">Average Supplier Lead Time</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">3 - 5 Days</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Synchronized with Central Warehouse</span>
                <span className="text-blue-500 font-bold">Lead Status OK</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: EMPLOYEE DASHBOARD (FRONTLINE TASK & CURATION)
          ======================================================== */}
      {userRole === ROLES.EMPLOYEE && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          {/* Employee 4 Frontline KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {employeeKpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl bg-gradient-to-r ${card.gradient} p-4 text-white shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/90 truncate">
                      {card.label}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black mt-2 truncate">{card.value}</h3>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-white/90">
                    <span className="bg-black/20 px-1 py-0.2 rounded font-bold">
                      {card.trend}
                    </span>
                    <span className="truncate opacity-80">{card.trendText}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Employee Action Center & Quick Shortcuts */}
          <div className={`rounded-2xl border ${cardBg} p-4 sm:p-5`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Frontline Actions & Workspace Shortcuts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/products"
                className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Browse Full Catalog
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Search products & inspect SKU</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/products"
                className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      Check Low Stock Items
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">26 items need restocking</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/profile"
                className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      My Identity & Passkeys
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Manage security credentials</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Employee Visual Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Weekly Activity Bar Chart */}
            <div
              onClick={() => handleOpenChartPreview(employeeThroughputConfig)}
              className={`rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              title="Click chart to preview and inspect details"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    My Daily Curation Throughput
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                    Target: 15 / Day
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                </div>
              </div>

              <div className="h-52 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeWeeklyActivity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                    <Bar dataKey="completed" name="Completed Updates" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="target" name="Daily Target" fill={isDark ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Average Performance: 94.2%</span>
                <span className="text-emerald-500 font-bold">On Schedule</span>
              </div>
            </div>

            {/* Fast Moving Categories Donut Chart */}
            <div
              onClick={() => handleOpenChartPreview(employeeDemandConfig)}
              className={`rounded-2xl border ${cardBg} p-4 sm:p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              title="Click chart to preview and inspect details"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-purple-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Top Demand Product Sectors
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 font-semibold">Live Demand</span>
                  <Maximize2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                </div>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutChartCategoryShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutChartCategoryShare.map((entry, index) => (
                        <Cell key={`donut-emp-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Top Fast-Mover: Beauty & Skin</span>
                <span className="text-purple-500 font-bold">35% Volume</span>
              </div>
            </div>
          </div>

          {/* Spotlight Catalog Items for Employee */}
          <div className={`rounded-2xl border ${cardBg} p-4 sm:p-5`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Catalog Quick Reference (Top Products)
                </h4>
              </div>
              <Link to="/products" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                View All {totalRecords} Records &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Rating</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {spotlightProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 max-w-[220px] truncate">
                        {item.title}
                      </td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-300 capitalize">{item.category}</td>
                      <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {item.rating || 4.5}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            (item.stock ?? 15) > 10
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {(item.stock ?? 15) > 10 ? 'In-Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Interactive Chart Preview Modal (Global across Admin, Manager, and Employee) */}
      <ChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        chart={previewChart}
      />
    </div>
  );
};

export default Dashboard;
