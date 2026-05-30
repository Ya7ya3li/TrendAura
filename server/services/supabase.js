import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

/**
 * TrendAura Core Sovereign Supabase Database Connector Client
 * Initialized with higher administrative capabilities via node environment envs.
 */
if (!env.supabaseUrl || !env.supabaseServiceKey) {
  console.error('🚨 [Supabase Critical Error]: روابط الاتصال والمفاتيح السرية مفقودة بملف الـ .env!');
}

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: {
    persistSession: false, // السيرفر لا يحتاج لحفظ الجلسة محلياً كالـ client
    autoRefreshToken: false
  }
});