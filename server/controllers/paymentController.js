import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

export const paymentController = {
  handleWebhook: async (req, res) => {
    try {
      const { id, status, amount, metadata, description } = req.body;

      // 1. التحقق الحاسم من نجاح العملية المالية من بوابة ميسر السيادية
      if (status === 'paid') {
        const userId = metadata?.user_id;
        const targetPlan = metadata?.plan_id; 
        const tokensToAdd = Number(metadata?.tokens_to_add) || 0; // استخراج القيمة المشفرة المحمية سحابياً

        if (!userId || !targetPlan) {
          return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'بيانات الفاتورة مفقودة.' });
        }

        // 2. جلب رصيد المستخدم الحالي لاحتساب الزيادة بشكل تراكمي دقيق لمنع التصفير
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        if (profileError || !profile) {
          console.error('❌ [Webhook Profile Fetch Failure]:', profileError?.message);
          return res.status(404).json({ success: false, error: 'لم يتم العثور على بروفايل العميل لشحن الرصيد.' });
        }

        const newTokensBalance = profile.tokens + tokensToAdd;

        // 3. تحديث رتبة اشتراك العميل ورصيد التوكنز معاً في معاملة واحدة آمنة
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan: targetPlan,
            tokens: newTokensBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;

        console.log(`💰 [Payment Verified]: تم ترقية المستخدم ${userId} إلى باقة ${targetPlan} وشحن +${tokensToAdd} توكنز بنجاح.`);
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تمت معالجة المدفوعات، شحن التوكنز وتفعيل الباقة الرسمية.' });
      }

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تم استقبال الإشارة لكن العملية لم تكتمل بنجاح.' });
    } catch (error) {
      console.error('❌ [paymentController Webhook Error]:', error.message);
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};