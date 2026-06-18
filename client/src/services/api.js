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
      // 👑 التعديل هنا: إجبار المتصفح على طباعة الخطأ كنص مقروء بالكامل
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

// 🚨 "الجرسون الذكي": يراقب كل الردود من السيرفر، وإذا لقط حالة طوارئ يتصرف فوراً
api.interceptors.response.use(
  (response) => {
    // إذا السيرفر راضي والطلب سليم، خله يمر
    return response;
  },
  (error) => {
    // 👑 إذا السيرفر رفض الطلب بكود 503 (يعني زر الطوارئ شغال)
    if (error.response && error.response.status === 503) {

      // توجيه إجباري وفوري لصفحة الصيانة
      window.location.href = '/maintenance';

    }
    return Promise.reject(error);
  }
);