"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/header';
import { Testimonials } from '@/components/landing/Testimonials';
import { BlogSection } from '@/components/landing/BlogSection';
import { useTranslation } from 'next-i18next';

// Importar los nuevos componentes de sección
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesOverview } from '@/components/landing/FeaturesOverview';
import { MainFeatures } from '@/components/landing/MainFeatures';
import { AdditionalFeatures } from '@/components/landing/AdditionalFeatures';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { PricingPlans } from '@/components/landing/PricingPlans';
import { ContactSection } from '@/components/landing/ContactSection';

export default function UnifiedLandingPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('landing');
  const [currency, setCurrency] = useState("Pesos");
  const [theme, setTheme] = useState("Claro");
  
  // Aplicar configuraciones
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    if (theme === "Oscuro") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [i18n.language, theme]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={`flex flex-col min-h-screen overflow-hidden ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      {/* Header */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        language={i18n.language === "es" ? "Español" : "English"}
        setLanguage={handleLanguageChange}
        currency={currency}
        setCurrency={setCurrency}
      />

      <HeroSection />
      <FeaturesOverview />
      <MainFeatures />
      <AdditionalFeatures />
      <StatisticsSection />
      <VideoDemo />

      {/* Testimonials */}
      <FadeIn delay={0.2}>
        <Testimonials />
      </FadeIn>

      {/* Blog Section */}
      <FadeIn delay={0.2}>
        <BlogSection />
      </FadeIn>

      <PricingPlans />
      <ContactSection />
    </div>
  );
}
