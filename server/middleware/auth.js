export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 🛡️ التعديل الجوهري: إذا لم يوجد توكن، لا تقم بطرد المستخدم فوراً!
    // اسمح للطلب بالمرور بـ req.user = null، ودع الـ Controller يقرر إذا كان يريد البيانات أو لا.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null; 
      return next(); 
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.jwtSecret, (err, decoded) => {
      if (err) {
        // إذا كان التوكن موجوداً ولكن غير صالح، نرفض فقط في هذه الحالة
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول.'
        });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        plan: decoded.plan || 'free'
      };
      
      return next();
    });
  } catch (error) {
    console.error('❌ [authGuard Security Violation]:', error.message);
    return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
    });
  }
};