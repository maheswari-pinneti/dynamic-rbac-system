import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CalendarDropdown = ({ initialDate = new Date(2026, 6, 11) }) => {
  const { info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed, 6 = July
  const dropdownRef = useRef(null);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const monthShortNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Format date helper: e.g. "11 Jul 2026"
  const formatDateDisplay = (date) => {
    const day = date.getDate();
    const month = monthShortNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Days in month calculation
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth - 1);

  // Select day handler
  const handleSelectDay = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    setSelectedDate(newDate);
    setIsOpen(false);
    info(`Catalog date filter set to ${formatDateDisplay(newDate)}`, 'Date Filter Applied');
  };

  // Preset selector
  const handlePreset = (presetType) => {
    let targetDate = new Date(2026, 6, 11);
    if (presetType === 'today') {
      targetDate = new Date(2026, 6, 11);
    } else if (presetType === 'yesterday') {
      targetDate = new Date(2026, 6, 10);
    } else if (presetType === 'week') {
      targetDate = new Date(2026, 6, 4);
    } else if (presetType === 'start') {
      targetDate = new Date(2026, 6, 1);
    }

    setSelectedDate(targetDate);
    setViewYear(targetDate.getFullYear());
    setViewMonth(targetDate.getMonth());
    setIsOpen(false);
    info(`Filter updated to ${formatDateDisplay(targetDate)}`, 'Preset Applied');
  };

  const isDaySelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const isToday = (day) => {
    return day === 11 && viewMonth === 6 && viewYear === 2026;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Date Pill Button matching screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-2xs hover:bg-slate-200/70 dark:hover:bg-slate-700/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 select-none ${
          isOpen
            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
            : 'border-slate-200/80 dark:border-slate-700/70'
        }`}
        title="Filter dashboard records by date"
        aria-label="Calendar date selector"
        aria-expanded={isOpen}
      >
        <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span className="font-bold tracking-tight whitespace-nowrap">{formatDateDisplay(selectedDate)}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-blue-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Calendar Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Quick Presets Row */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80 gap-1.5">
            <button
              type="button"
              onClick={() => handlePreset('today')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors text-[11px] font-semibold"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePreset('yesterday')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors text-[11px] font-semibold"
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => handlePreset('week')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors text-[11px] font-semibold"
            >
              Last 7D
            </button>
            <button
              type="button"
              onClick={() => handlePreset('start')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors text-[11px] font-semibold"
            >
              This Month
            </button>
          </div>

          {/* Calendar Month & Navigation Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {monthNames[viewMonth]} {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-medium">
            {/* Previous month padding days */}
            {Array.from({ length: firstDayIndex }).map((_, index) => {
              const dayNum = daysInPrevMonth - firstDayIndex + index + 1;
              return (
                <div
                  key={`prev-${index}`}
                  className="py-1.5 text-slate-300 dark:text-slate-700 text-xs pointer-events-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, index) => {
              const dayNum = index + 1;
              const selected = isDaySelected(dayNum);
              const today = isToday(dayNum);

              return (
                <button
                  key={`cur-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`py-1.5 rounded-lg text-xs transition-all relative font-semibold ${
                    selected
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                      : today
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{dayNum}</span>
                  {today && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer with Selected Date & Reset */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span>Selected:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatDateDisplay(selectedDate)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedDate(initialDate);
                setViewYear(initialDate.getFullYear());
                setViewMonth(initialDate.getMonth());
                setIsOpen(false);
                info('Reset date filter to 11 Jul 2026', 'Date Reset');
              }}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;

