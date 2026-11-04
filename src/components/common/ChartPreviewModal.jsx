import React, { useEffect, useState } from 'react';
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
  X,
  Maximize2,
  TrendingUp,
  Download,
  Copy,
  Check,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Boxes,
  Activity,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Badge from './Badge';
import Button from './Button';

export const ChartPreviewModal = ({ isOpen, onClose, chart }) => {
  const { isDark } = useTheme();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !chart) return null;

  const gridStroke = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  // Custom high-contrast tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-2xl border border-slate-700 min-w-[140px]">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5">
            {label || payload[0]?.name}
          </p>
          {payload.map((entry, index) => (
            <p key={`entry-${index}`} className="flex items-center justify-between gap-3 text-[11px] py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value !== undefined ? entry.value : entry.payload?.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleCopySummary = () => {
    const summaryText = `${chart.title}\n${chart.subtitle || ''}\n\n` +
      (chart.data || [])
        .map((d) => {
          const key = d.name || d.month || d.day || 'Item';
          const val = d.count ?? d.records ?? d.value ?? d.completed ?? '';
          return `${key}: ${val}`;
        })
        .join('\n');

    navigator.clipboard?.writeText(summaryText);
    setCopied(true);
    success('Chart data summary copied to clipboard!', 'Summary Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (!chart.data || chart.data.length === 0) return;
    const keys = Object.keys(chart.data[0]).filter((k) => k !== 'color');
    const rows = chart.data.map((item) => keys.map((k) => `"${item[k] ?? ''}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [keys.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${(chart.title || 'Chart_Data').replace(/[^a-z0-9]/gi, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Chart data exported as CSV spreadsheet.', 'Exported');
  };

  const IconComponent = chart.icon || BarChart3;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 text-center">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-[#0c1322] text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs flex-shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {chart.title}
                  </h3>
                  {chart.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {chart.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {chart.subtitle || 'Expanded high-resolution metric visualization'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title="Copy text summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                title="Export data as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                aria-label="Close chart preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Top KPI Metrics Bar */}
            {chart.metrics && chart.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {chart.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                      {m.label}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {m.value}
                      </span>
                      {m.change && (
                        <span
                          className={`text-[10px] font-bold ${
                            m.isPositive !== false
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {m.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* High-Resolution Interactive Chart Container */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 bg-slate-50/30 dark:bg-slate-900/30">
              <div className="h-80 w-full">
                {chart.type === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart.data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey={chart.xAxisKey || 'month'} tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                      {(chart.series || [
                        { key: 'records', name: 'Total Records', color: '#2563eb', strokeWidth: 3 },
                        { key: 'active', name: 'In-Stock Units', color: '#10b981', strokeWidth: 2.5, dashed: true },
                      ]).map((s, idx) => (
                        <Line
                          key={s.key || idx}
                          type="monotone"
                          dataKey={s.key}
                          name={s.name}
                          stroke={s.color}
                          strokeWidth={s.strokeWidth || 2.5}
                          strokeDasharray={s.dashed ? '4 4' : undefined}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart.data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey={chart.xAxisKey || 'name'} tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                      {(chart.series || [
                        { key: 'count', name: 'Count', color: '#0d9488' },
                      ]).map((s, idx) => (
                        <Bar
                          key={s.key || idx}
                          dataKey={s.key}
                          name={s.name}
                          fill={s.color}
                          radius={[6, 6, 0, 0]}
                          maxBarSize={40}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chart.data.map((entry, index) => (
                          <Cell key={`cell-pie-modal-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'donut' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={105}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {chart.data.map((entry, index) => (
                            <Cell key={`cell-donut-modal-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                      <IconComponent className="w-7 h-7 text-blue-600 dark:text-blue-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {chart.centerLabel || 'Share'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Data Table Breakdown */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Data Point Breakdown
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {chart.data?.length || 0} Records Captured
                </span>
              </div>

              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/40 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-4">Series Item</th>
                      <th className="py-2.5 px-4 text-center">Value / Count</th>
                      <th className="py-2.5 px-4 text-right">Status / Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    {(chart.data || []).map((row, idx) => {
                      const label = row.name || row.month || row.day || `Item #${idx + 1}`;
                      const value = row.count ?? row.records ?? row.value ?? row.completed ?? 0;
                      const secondary = row.active !== undefined ? `In-Stock: ${row.active}` : row.target !== undefined ? `Target: ${row.target}` : null;
                      const dotColor = row.color || (chart.series?.[0]?.color) || '#3b82f6';

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-2.5 px-4 font-semibold flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: dotColor }}
                            />
                            <span>{label}</span>
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold">
                            {value}
                            {secondary && (
                              <span className="text-[10px] text-slate-400 font-normal ml-2">
                                ({secondary})
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Active Data Point
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreviewModal;

