import React from 'react'

/**
 * TrendAura Sidebar Navigation Items Matrix - Pure JS V2 Blueprint
 * Structured with exactly 5 strategic commercial application routes.
 */
export const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    path: '/dashboard',
    icon: React.createElement('svg', { className: "w-5 h-5 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('path', { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
      React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
    )
  },
  {
    id: 'history',
    name: 'السكربتات',
    path: '/history',
    icon: React.createElement('svg', { className: "w-5 h-5 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
      React.createElement('polyline', { points: "14 2 14 8 20 8" }),
      React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" }),
      React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17" })
    )
  },
  {
    id: 'pricing',
    name: 'الاشتراكات',
    path: '/pricing',
    icon: React.createElement('svg', { className: "w-5 h-5 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('path', { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" })
    )
  },
  {
    id: 'billing',
    name: 'إدارة الاشتراك',
    path: '/billing',
    icon: React.createElement('svg', { className: "w-5 h-5 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('rect', { x: "2", y: "5", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement('line', { x1: "2", y1: "10", x2: "22", y2: "10" })
    )
  },
  {
    id: 'settings',
    name: 'الإعدادات',
    path: '/settings',
    icon: React.createElement('svg', { className: "w-5 h-5 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('circle', { cx: "12", cy: "12", r: "3" }),
      React.createElement('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
    )
  }
];

export const getSidebarItems = (currentPlan = 'free') => {
  return SIDEBAR_ITEMS;
};