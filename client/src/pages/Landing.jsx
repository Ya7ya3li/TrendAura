import React from 'react'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import PricingPreview from '../components/landing/PricingPreview'
import ComparisonTable from '../components/landing/PlanComparison'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

/**
 * TrendAura Marketing Landing Page
 * Seamlessly chains promotional and structural modules for conversion generation.
 */
export default function Landing() {
  return (
    <div className="w-full bg-slate-50 flex flex-col dir-rtl text-right select-none animate-fade-in">
      {/* 🚀 قسم الواجهة الترحيبية والخطاف البصري التسويقي */}
      <HeroSection />
      
      {/* ⚡ قطاع الميزات التفصيلية ومحرك الذكاء الاصطناعي الفايرال */}
      <FeaturesSection />
      
      {/* 💎 استعراض سريع لأسعار الباقات الحالية المعتمدة */}
      <PricingPreview />
      
      {/* 📊 جدول المقارنة الفولاذي بين الصلاحيات المتاحة والمقيدة */}
      <ComparisonTable />
      
      {/* 💬 قسم آراء وتجارب كبار صناع المحتوى المحترفين في تيك توك */}
      <Testimonials />
      
      {/* ❓ مصفوفة الأسئلة الشائعة وحلول الاعتراضات الشائعة */}
      <FAQ />
      
      {/* 🎯 قسم نداء الإجراء الختامي لحث العميل على بدء التجربة */}
      <CTASection />
      
      {/* 🏁 تذييل الصفحة الختامي الحاضن للروابط القانونية والتوثيق */}
      <Footer />
    </div>
  )
}