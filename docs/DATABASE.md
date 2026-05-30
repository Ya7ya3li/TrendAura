# 📊 TrendAura V2 - Database Architecture & Schema

تعتمد المنصة على بنية تحتية سحابية هجينة وموزعة عبر **Supabase (PostgreSQL)**، مع تفعيل سياسات الأمان الصارمة (Row Level Security) لعزل بيانات صناع المحتوى ومنع أي تداخل رقمي.

## 🧱 المصفوفة الهيكلية للجداول (Database Schema)

### 1. جدول الحسابات والبروفايل `profiles`
يخزن البيانات السيادية لصانع المحتوى ورتبة رخصته الحية:
* `id` (uuid, Primary Key) -> مرتبط بنظام الـ Auth المركزي.
* `full_name` (text) -> الاسم المعروض للمستخدم.
* `avatar_url` (text) -> رابط الصورة الشخصية المستضافة سحابياً.
* `plan` (text) -> رتبة الباقة الحالية (`free` | `pro` | `viral_engine`).
* `subscription_status` (text) -> حالة الاشتراك الحالية (`active` | `canceled`).
* `tokens` (integer) -> رصيد التوكنز التراكمي المتاح حالياً للمعالجة.
* `referral_code` (text) -> كود الإحالة الفريد لجمع المكافآت.

### 2. جدول السكريبتات والأرشيف `generated_scripts`
المستودع السحابي المسؤول عن تغذية شاشة السكربتات والأرشيف:
* `id` (uuid, Primary Key) -> المعرف الفريد للسيناريو.
* `user_id` (uuid, Foreign Key) -> مرتبط بجدول الـ `profiles`.
* `prompt_summary` (text) -> عنوان أو ملخص الفكرة التوليدية.
* `content` (text) -> النص والسيناريو الكامل المولّد بواسطة الـ AI.
* `created_at` (timestamp) -> طابع تاريخ ووقت التوليد (يغذي عداد آخر نشاط).

### 3. جدول المقبوضات المالية وفواتير ميسر `invoices`
يغذي المقر المالي الجديد في شاشة إدارة الاشتراك:
* `id` (uuid, Primary Key) -> معرف الفاتورة الداخلي.
* `user_id` (uuid, Foreign Key) -> مرتبط بجدول الـ `profiles`.
* `payment_id` (text) -> رقم العملية الدولي القادم من بوابة الدفع Moyasar.
* `plan_type` (text) -> نوع الباقة المشتراة أو المشحونة.
* `amount` (numeric) -> المبلغ المدفوع بالعملة المحلية (SAR).
* `created_at` (timestamp) -> تاريخ تنفيذ العملية البنكية بنجاح.

## 🛡️ سياسات الحماية وأمن البيانات (RLS Policies)
جميع الجداول مقفلة ومحمية بسياسة حتمية:
```sql
ALTER TABLE generated_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read/write their own scripts" 
ON generated_scripts 
FOR ALL 
USING (auth.uid() = user_id);