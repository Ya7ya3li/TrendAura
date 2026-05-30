import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Moyasar Payment Ingestion Gateway Controller
 */
export const paymentController = {
  handleWebhook: async (req, res) => {
    try {
      const { id, status, amount, metadata, description } = req.body;

      // 1. التحقق من نجاح العملية المالية من بوابة ميسر
      if (status === 'paid') {
        const userId = metadata?.user_id;
        const targetPlan = metadata?.plan_id; // مثل: pro أو viral_engine

        if (!userId || !targetPlan) {
          return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'بيانات الفاتورة مفقودة.' });
        }

        // 2. تحديث رتبة اشتراك العميل وتدوين الفاتورة في سوبابيس حياً
        const { error } = await supabase
          .from('profiles')
          .update({ plan: targetPlan })
          .eq('id', userId);

        if (error) throw error;

        console.log(`💰 [Payment Success]: تم ترقية المستخدم ${userId} إلى باقة ${targetPlan} بنجاح.`);
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تمت معالجة المدفوعات وتفعيل الباقة.' });
      }

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تم استقبال الإشارة لكن العملية لم تكتمل.' });
    } catch (error) {
      console.error('❌ [paymentController Webhook Error]:', error.message);
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};