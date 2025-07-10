"use client";

import React, { useState, useEffect, ReactNode, FC } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/header';
import { Testimonials } from '@/components/landing/Testimonials';
import { BlogSection } from '@/components/landing/BlogSection';

// Importar los nuevos componentes de sección
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesOverview } from '@/components/landing/FeaturesOverview';
import { MainFeatures } from '@/components/landing/MainFeatures';
import { AdditionalFeatures } from '@/components/landing/AdditionalFeatures';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { PricingPlans } from '@/components/landing/PricingPlans';
import { ContactSection } from '@/components/landing/ContactSection';

// Componente de animación
const FadeIn: FC<{ children: ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <div style={{ animation: `fadeIn 1s ease-in-out ${delay}s forwards`, opacity: 0 }}>
      {children}
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState("Pesos");
  const [theme, setTheme] = useState("Claro");
  
  // Aplicar configuraciones
  useEffect(() => {
    if (theme === "Oscuro") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  const handleLanguageChange = (lang: string) => {
    console.log(`Language change to ${lang} not implemented yet.`);
  };

  return (
    <div className={`flex flex-col min-h-screen overflow-hidden ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      {/* Header */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        language={"Español"}
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

      <Plans theme={theme} currency={currency} />
      <ContactSection />
    </div>
  );
}