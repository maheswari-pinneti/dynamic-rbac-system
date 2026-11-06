import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-md', style = {} }) => {
  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800 ${rounded} ${className}`}
    />
  );
};

export const TableSkeleton = ({ rows = 8, cols = 6 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24 hidden sm:block" />
        <Skeleton className="h-4 w-28 hidden md:block" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16 hidden lg:block" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between px-6 py-3.5 gap-4">
          {/* Product Thumbnail + Title + Brand */}
          <div className="flex items-center gap-3 min-w-[200px] flex-1">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="space-y-1.5 flex-1 max-w-[240px]">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
          {/* Department / Category */}
          <div className="hidden sm:block w-28">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          {/* Stock Condition */}
          <div className="hidden md:block w-28">
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          {/* Price (INR) */}
          <div className="w-20 text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
          {/* Rating */}
          <div className="hidden lg:flex items-center gap-1 w-20">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 justify-end w-24">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-5 animate-pulse">
      {/* Role Banner Skeleton */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#091124] border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 rounded-xl hidden sm:block" />
      </div>

      {/* KPI Cards Skeleton (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-2.5 w-36" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <div className="h-64 flex items-end gap-3 pt-6 px-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="flex-1 rounded-t-lg"
                style={{ height: `${35 + ((idx * 17) % 55)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="w-44 h-44 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* KPI Cards (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 space-y-3"
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ))}
      </div>

      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="h-60 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-center p-4">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
