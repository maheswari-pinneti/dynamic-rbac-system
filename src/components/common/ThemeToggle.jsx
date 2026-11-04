import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({
  className = '',
  size = 'md',
  variant = 'switch', // 'switch' | 'button'
  showLabel = false,
}) => {
  const { isDark, toggleTheme, humanThemeName } = useTheme();

  // Size definitions for the sliding pill switch
  const sizeMap = {
    sm: {
      track: 'w-12 h-6 p-0.5',
      knob: 'w-5 h-5',
      translateX: 'translate-x-[24px]',
      icon: 'w-3 h-3',
      trackIcon: 'w-2.5 h-2.5',
    },
    md: {
      track: 'w-14 h-7.5 p-0.5',
      knob: 'w-6.5 h-6.5',
      translateX: 'translate-x-[26px]',
      icon: 'w-3.5 h-3.5',
      trackIcon: 'w-3 h-3',
    },
    lg: {
      track: 'w-16 h-8.5 p-1',
      knob: 'w-6.5 h-6.5',
      translateX: 'translate-x-[30px]',
      icon: 'w-4 h-4',
      trackIcon: 'w-3.5 h-3.5',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Single morphing button variant
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-xs group ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-slate-600'
            : 'bg-white hover:bg-slate-50 text-amber-600 border-slate-200 hover:border-slate-300'
        } ${className}`}
        title={isDark ? 'Dark mode active • Click for Light mode' : 'Light mode active • Click for Dark mode'}
        aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          <Sun
            className={`w-4 h-4 text-amber-500 transition-all duration-300 transform absolute ${
              isDark
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <Moon
            className={`w-4 h-4 text-indigo-400 transition-all duration-300 transform absolute ${
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-semibold ml-1.5 text-slate-700 dark:text-slate-200">
            {humanThemeName}
          </span>
        )}
      </button>
    );
  }

  // Dual-Track Sliding Pill Switch (Default & Premium)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer select-none border shadow-inner ${
        currentSize.track
      } ${
        isDark
          ? 'bg-slate-850 dark:bg-slate-900 border-slate-700/80 shadow-slate-950/60'
          : 'bg-slate-200/90 border-slate-300/80 shadow-slate-300/50'
      } ${className}`}
      title={isDark ? 'Dark mode active • Click for Light mode' : 'Light mode active • Click for Dark mode'}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      role="switch"
      aria-checked={isDark}
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun
          className={`${currentSize.trackIcon} transition-opacity duration-300 ${
            isDark ? 'text-slate-500 opacity-40' : 'text-amber-500 opacity-0'
          }`}
        />
        <Moon
          className={`${currentSize.trackIcon} transition-opacity duration-300 ${
            isDark ? 'text-indigo-400 opacity-0' : 'text-slate-400 opacity-40'
          }`}
        />
      </div>

      {/* Sliding Rounded Thumb Knob */}
      <span
        className={`inline-flex items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform shadow-md ${
          currentSize.knob
        } ${
          isDark
            ? `${currentSize.translateX} bg-slate-950 border border-slate-700/80 text-indigo-300 shadow-black/60 group-hover:scale-105`
            : 'translate-x-0 bg-white border border-slate-200/90 text-amber-500 shadow-slate-400/30 group-hover:scale-105'
        }`}
      >
        {isDark ? (
          <Moon
            className={`${currentSize.icon} fill-indigo-400/20 text-indigo-300 transform transition-transform duration-300 group-hover:-rotate-12`}
          />
        ) : (
          <Sun
            className={`${currentSize.icon} fill-amber-400/25 text-amber-500 transform transition-transform duration-300 group-hover:rotate-45`}
          />
        )}
      </span>

      {showLabel && (
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ml-2">
          {humanThemeName}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
