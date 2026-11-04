import React, { useState } from 'react';
import {
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
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Boxes,
  ShieldCheck,
  Activity,
  Layers,
  ArrowUpRight,
  Maximize2,
} from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ChartPreviewModal from '../../components/common/ChartPreviewModal';

export const Analytics = () => {
  const { allProducts } = useProduct();
  const { currentUser, users } = useAuth();
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');
  // Interactive Chart Preview Modal State
  const [previewChart, setPreviewChart] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenChartPreview = (config) => {
    setPreviewChart(config);
    setIsPreviewOpen(true);
  };


  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs';

  const totalRecords = allProducts?.length || 194;
  const activeRecords = (allProducts || []).filter((p) => (p.stock ?? 15) > 10).length || 168;
  const lowStockRecords = (allProducts || []).filter((p) => (p.stock ?? 15) <= 10).length || 26;

  // Chart 1: Line Chart Data (Monthly Growth)
  const lineChartData = [
    { month: 'Feb', records: 125, active: 108 },
    { month: 'Mar', records: 142, active: 124 },
    { month: 'Apr', records: 156, active: 138 },
    { month: 'May', records: 170, active: 150 },
    { month: 'Jun', records: 182, active: 160 },
    { month: 'Jul', records: 194, active: 168 },
  ];

  // Chart 2: Bar Chart Data (Record Distribution)
  const barChartData = [
    { name: 'Beauty', count: 42 },
    { name: 'Furniture', count: 35 },
    { name: 'Fragrances', count: 28 },
    { name: 'Groceries', count: 24 },
    { name: 'Laptops', count: 18 },
    { name: 'Phones', count: 15 },
  ];

  // Chart 3: Pie Chart Data (Status Distribution - Solid Pie)
  const pieChartData = [
    { name: 'In-Stock Ready', value: Math.max(1, activeRecords), color: '#10b981' },
    { name: 'Low Stock Alert', value: Math.max(1, lowStockRecords > 4 ? lowStockRecords - 4 : lowStockRecords), color: '#f59e0b' },
    { name: 'Critical Outage', value: Math.max(1, Math.min(lowStockRecords, 4)), color: '#ef4444' },
  ];

  // Chart 4: Donut Chart Data (Activity Trend & Operations Share)
  const donutChartData = [
    { name: 'Read & Query Calls', value: 55, color: '#2563eb' },
    { name: 'Catalog Updates', value: 25, color: '#10b981' },
    { name: 'Create Operations', value: 12, color: '#f59e0b' },
    { name: 'Delete Operations', value: 8, color: '#ef4444' },
  ];


  // ==========================================================
  // CHART PREVIEW CONFIGURATIONS
  // ==========================================================
  const analyticsGrowthConfig = {
    title: 'Monthly Catalog Growth',
    subtitle: '6-Month historical catalog trajectory vs. in-stock fulfillment',
    type: 'line',
    icon: LineIcon,
    badge: '+18.4% MoM',
    data: lineChartData,
    xAxisKey: 'month',
    series: [
      { key: 'records', name: 'Total Records', color: '#2563eb', strokeWidth: 3 },
      { key: 'active', name: 'In-Stock Units', color: '#10b981', strokeWidth: 2.5, dashed: true },
    ],
    metrics: [
      { label: 'Current Total Records', value: '194 Units', change: '+18.4%', isPositive: true },
      { label: 'In-Stock Ready Units', value: '168 Units', change: '86.6% Rate', isPositive: true },
      { label: '6-Month Net Growth', value: '+69 Items', change: '+55.2%', isPositive: true },
      { label: 'Peak Velocity Month', value: 'Jul 2026', change: 'Current', isPositive: true },
    ],
  };

  const analyticsDistributionConfig = {
    title: 'Record Distribution by Sector',
    subtitle: 'Catalog items categorized by commercial product category',
    type: 'bar',
    icon: BarChart3,
    badge: '24 Sectors',
    data: barChartData,
    xAxisKey: 'name',
    series: [
      { key: 'count', name: 'Items in Catalog', color: '#0d9488' },
    ],
    metrics: [
      { label: 'Lead Product Sector', value: 'Beauty (42)', change: '25.9% Share', isPositive: true },
      { label: 'Second Sector', value: 'Furniture (35)', change: '21.6% Share', isPositive: true },
      { label: 'Average Items / Sector', value: '27 Items', change: 'Balanced', isPositive: true },
      { label: 'Active Monitored SKUs', value: '162 Units', change: '100% Synced', isPositive: true },
    ],
  };

  const analyticsStatusConfig = {
    title: 'Inventory Status Distribution',
    subtitle: 'Stock buffer evaluation and replenishment thresholds',
    type: 'pie',
    icon: PieIcon,
    badge: '86% In-Stock',
    data: pieChartData,
    metrics: [
      { label: 'In-Stock Ready', value: '168 SKUs', change: '86% Healthy', isPositive: true },
      { label: 'Low Stock Priority', value: '22 SKUs', change: '11% Reorder', isPositive: false },
      { label: 'Critical Outage Alert', value: '4 SKUs', change: 'Action Required', isPositive: false },
      { label: 'Fulfillment Index', value: '96.8%', change: '+1.2%', isPositive: true },
    ],
  };

  const analyticsActivityConfig = {
    title: 'Activity Trend & Operations Share',
    subtitle: 'Breakdown of team query calls, catalog modifications, and system operations',
    type: 'donut',
    icon: Boxes,
    centerLabel: 'Activity',
    badge: '100 Operations',
    data: donutChartData,
    metrics: [
      { label: 'Read & Query Calls', value: '55 Calls', change: '55% Volume', isPositive: true },
      { label: 'Catalog Updates', value: '25 Updates', change: '25% Volume', isPositive: true },
      { label: 'Create Operations', value: '12 Adds', change: '12% Volume', isPositive: true },
      { label: 'Delete Operations', value: '8 Removes', change: '8% Volume', isPositive: false },
    ],
  };

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Analytics Dashboard"
        subtitle="Multi-dimensional trend analysis, capacity forecasting, and dynamic RBAC activity analytics."
        badge="Live Metrics"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 text-xs shadow-2xs">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-blue-100 text-xs">
            <span className="font-bold uppercase tracking-wider">Catalog Health Index</span>
            <Activity className="w-4 h-4 text-blue-200" />
          </div>
          <div className="text-3xl font-extrabold mt-2 tracking-tight">96.4%</div>
          <p className="text-xs text-blue-100 mt-1">
            +3.8% inventory buffer accuracy across 24 sectors
          </p>
        </div>

        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Daily REST Operations</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            1,420 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+18.2%</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Synchronized with DummyJSON REST backend
          </p>
        </div>

        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Dynamic RBAC Matrix</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            9 Matrix Rules
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enforced dynamically at runtime across all roles
          </p>
        </div>
      </div>

      {/* 4 Core Recharts Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CHART 1: LINE CHART — Monthly Growth */}
        <div
          onClick={() => handleOpenChartPreview(analyticsGrowthConfig)}
          className={`rounded-2xl border ${cardBg} p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
          title="Click chart to preview and inspect details"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <LineIcon className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Monthly Growth (Line Chart)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">Line Chart</Badge>
              <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="records" name="Total Records" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="active" name="In-Stock Units" stroke="#10b981" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BAR CHART — Record Distribution */}
        <div
          onClick={() => handleOpenChartPreview(analyticsDistributionConfig)}
          className={`rounded-2xl border ${cardBg} p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
          title="Click chart to preview and inspect details"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Record Distribution (Bar Chart)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">Bar Chart</Badge>
              <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="count" name="Items in Catalog" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: PIE CHART — Status Distribution (Solid Pie) */}
        <div
          onClick={() => handleOpenChartPreview(analyticsStatusConfig)}
          className={`rounded-2xl border ${cardBg} p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
          title="Click chart to preview and inspect details"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Status Distribution (Pie Chart)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="sm">Solid Pie Chart</Badge>
              <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: DONUT CHART — Activity Trend */}
        <div
          onClick={() => handleOpenChartPreview(analyticsActivityConfig)}
          className={`rounded-2xl border ${cardBg} p-5 flex flex-col justify-between cursor-pointer group hover:border-blue-500/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative`}
          title="Click chart to preview and inspect details"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Activity Trend (Donut Chart)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">Donut Chart</Badge>
              <span className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity p-0.5 rounded" title="Preview chart">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="relative h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutChartData.map((entry, index) => (
                    <Cell key={`donut-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chart Preview Modal */}
      <ChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        chart={previewChart}
      />
    </div>
  );
};

export default Analytics;
