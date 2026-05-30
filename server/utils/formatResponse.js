/**
 * TrendAura Express Global API Response Structural Standardizer
 */
export const formatResponse = {
  success: (payloadData = null, customMessage = '') => {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      ...(customMessage && { message: customMessage }),
      ...(payloadData && { data: payloadData })
    };
  },

  error: (errorMessage = 'حدث خطأ غير متوقع في خوادم المعالجة', code = 'INTERNAL_ERROR') => {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code,
        message: errorMessage
      }
    };
  }
};