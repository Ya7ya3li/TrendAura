import axios from 'axios';
import { ENV } from './env.js'; // مطابقة دقيقة لامتداد الملفات في Vite
import { supabase } from './supabase.js';

/**
 * TrendAura Axios Network Instance config
 * Automatically injects Supabase Auth JWT tokens into server-bound requests.
 * Fully verified to bind with unified ENV.API_URL routing matrix.
 */
const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 60000, // 🔥 تم رفع المهلة لـ 60 ثانية لانتظار عمليات توليد OpenAI/OpenRouter المعقدة والديناميكية
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 🔒 محقن الأمان لحقن التوكن حياً قبل خروج الطلب للسيرفر
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('❌ [Axios Interceptor Auth Token Fetch Error]:', err.message);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;