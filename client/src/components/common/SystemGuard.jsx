import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../config/axios.js';

export default function SystemGuard() {
    const location = useLocation();

    useEffect(() => {
        // 🛡️ حماية اللوحة الإدارية وصفحة الصيانة من الطرد عشان تقدر تدخل تفك القفل
        if (location.pathname.startsWith('/admin') || location.pathname === '/maintenance') return;

        const checkSystemStatus = async () => {
            try {
                // ضربة خفية للسيرفر للتأكد من حالة النظام
                await axiosInstance.get('/api/system-status');
            } catch (error) {
                // إذا رد السيرفر بـ 503 (حالة طوارئ)، يتم توجيه المستخدم فوراً
                if (error?.response?.status === 503) {
                    window.location.href = '/maintenance';
                }
            }
        };

        // 1. فحص فوري ومباشر عند فتح أي صفحة
        checkSystemStatus();

        // 2. فحص صامت كل 15 ثانية لطردهم "لايف" وهم يتصفحون
        const radar = setInterval(checkSystemStatus, 15000);

        return () => clearInterval(radar);
    }, [location.pathname]);

    return null; // الرادار يعمل في الكواليس ولا يظهر بالشاشة
}