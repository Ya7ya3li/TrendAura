import axiosInstance from "/src/config/axios.js";

/**
 * TrendAura Core API Request Wrapper
 * Abstracts standard HTTP methods over verified axios infrastructure.
 */
export const api = {
  async get(url, config = {}) {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      // 👑 إجبار المتصفح على طباعة الخطأ كنص مقروء بالكامل
      console.error(`❌ [API Service GET Error] on ${url}:`, JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`❌ [API Service POST Error] on ${url}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`❌ [API Service PUT Error] on ${url}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`❌ [ API Service DELETE Error] on ${url}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

// 🚨 "الجرسون الذكي" (رادار مراقبة الاستجابات وتطبيق الأقفال)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 👑 حماية فولاذية: نتأكد أولاً إن الـ error موجود وداخله response
    if (error && error.response) {

      // 🛑 1. بروتوكول الحظر والعزل (403 Forbidden)
      if (error.response.status === 403) {
        // تنبيه المستخدم المحظور
        alert(error.response.data.error || 'تم حظر حسابك من الشبكة.');

        // مسح الهوية المضروبة من متصفح العميل
        localStorage.clear();
        sessionStorage.clear();

        // الطرد الفوري لصفحة الدخول
        window.location.href = '/login';
      }

      // 🚨 2. بروتوكول الصيانة الفيدرالية (503 Service Unavailable)
      if (error.response.status === 503) {
        // توجيه إجباري وفوري لصفحة الصيانة
        window.location.href = '/maintenance';
      }
    }

    return Promise.reject(error);
  }
);