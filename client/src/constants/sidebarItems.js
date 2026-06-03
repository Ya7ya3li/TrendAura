import React from 'react'
import { ROUTES } from '../constants/routes' // استيراد المسارات الموحدة

export const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    path: ROUTES.DASHBOARD, // ربط ديناميكي
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('path', { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
      React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
    )
  },
  {
    id: 'history',
    name: 'السكربتات',
    path: ROUTES.HISTORY,
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
      React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" })
    )
  },
  {
    id: 'subscription', // تم التعديل ليتوافق مع إدارة الاشتراك
    name: 'إدارة الاشتراك',
    path: ROUTES.SUBSCRIPTION, // المسار الموحد الصحيح
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('rect', { x: "2", y: "5", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement('line', { x1: "2", y1: "10", x2: "22", y2: "10" })
    )
  },
  {
    id: 'settings',
    name: 'الإعدادات',
    path: ROUTES.SETTINGS,
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('circle', { cx: "12", cy: "12", r: "3" }),
      React.createElement('path', { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })
    )
  }
];

export const getSidebarItems = (currentPlan = 'free') => {
  return SIDEBAR_ITEMS;
};