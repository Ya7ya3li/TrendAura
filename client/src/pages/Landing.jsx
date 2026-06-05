import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { ROUTES } from '../constants/routes.js'
import HeroSection from '../components/landing/HeroSection.jsx'
import FeaturesSection from '../components/landing/FeaturesSection.jsx'
import PricingPreview from '../components/landing/PricingPreview.jsx'
import PlanComparison from '../components/landing/PlanComparison.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import FAQ from '../components/landing/FAQ.jsx'
import CTASection from '../components/landing/CTASection.jsx'
import Footer from '../components/landing/Footer.jsx'

export default function Landing() {
  const { user, loading } = useContext(AuthContext)

  // 🛡️ الصمام التلقائي: قذف فوري للداخل لمنع هدر الموارد وتكرار التحميل
  if (!loading && user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="w-full bg-slate-950 flex flex-col dir-rtl text-right select-none animate-fade-in">
      <HeroSection />
      <FeaturesSection />
      <PricingPreview />
      <PlanComparison />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}