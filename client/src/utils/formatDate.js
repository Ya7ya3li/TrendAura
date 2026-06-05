/**
 * TrendAura Premium Date Localization Formatter
 * Converts ISO timestamps into clean, human-readable Arabic strings.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    };
    
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  } catch (error) {
    console.error('❌ [formatDate Utility Crash]:', error.message);
    return dateString;
  }
};

/**
 * حساب الوقت المنقضي بشكل نسبي مريح للمستخدم (مثال: منذ 5 دقائق)
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'الآن';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    return formatDate(dateString);
  } catch (error) {
    return dateString;
  }
};