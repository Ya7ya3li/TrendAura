import { supabase } from '../config/supabase';

/**
 * TrendAura Federated Identity and Authentication Services
 */
export const authService = {
  /**
   * 🔐 تسجيل دخول مستخدم قياسي عبر البريد وكلمة المرور
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  /**
   * 📝 إنشاء حساب لمبدع جديد في منظومة الأمان
   */
  async register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: fullName } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * 🔒 تسجيل الخروج الكلي وتطهير جلسة العميل
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * 👤 تحديث بيانات البروفايل الشخصي للمستخدم في قاعدة البيانات
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};