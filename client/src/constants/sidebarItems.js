import React from 'react'
import { ROUTES } from './routes.js'

export const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    path: ROUTES.DASHBOARD,
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }),
      React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
    )
  },
  {
    id: 'history',
    name: 'السكربتات',
    path: ROUTES.HISTORY,
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 00 2 2h12a2 2 0 00 2-2V8z" }),
      React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" })
    )
  },
  {
    id: 'pricing', 
    name: 'الاشتراكات',
    path: ROUTES.PRICING, 
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
      React.createElement('polygon', { strokeLinecap: "round", strokeLinejoin: "round", points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
    )
  },
  {
    id: 'subscription',
    name: 'إدارة الاشتراك',
    path: ROUTES.SUBSCRIPTION,
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
      React.createElement('rect', { strokeLinecap: "round", strokeLinejoin: "round", x: "2", y: "5", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement('line', { x1: "2", y1: "10", x2: "22", y2: "10" })
    )
  },
  {
    id: 'settings',
    name: 'الإعدادات',
    path: ROUTES.SETTINGS,
    /* ⚙️ تم إعادة تشييد أيقونة الترس الهندسي الفاخر بالـ SVG بدلاً من أيقونة الشمس السابقة */
    icon: React.createElement('svg', { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
      React.createElement('circle', { cx: "12", cy: "12", r: "3" })
    )
  }
];

export const getSidebarItems = (currentPlan = 'free') => {
  return SIDEBAR_ITEMS;
};