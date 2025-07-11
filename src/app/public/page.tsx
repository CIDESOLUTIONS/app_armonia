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

export const metadata: Metadata = {
  title: 'Armonía - Gestión Inteligente de Conjuntos Residenciales',
  description: 'Transforma la administración de tu conjunto residencial con Armonía. Plataforma todo-en-uno para finanzas, asambleas, seguridad, y comunicación.',
  keywords: ['administración de condominios', 'software para conjuntos residenciales', 'gestión de propiedades', 'asambleas virtuales', 'seguridad residencial'],
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

      <FadeInWhenVisible><HeroSection /></FadeInWhenVisible>
      <FadeInWhenVisible><FeaturesOverview /></FadeInWhenVisible>
      <FadeInWhenVisible><MainFeatures /></FadeInWhenVisible>
      <FadeInWhenVisible><AdditionalFeatures /></FadeInWhenVisible>
      <FadeInWhenVisible><StatisticsSection /></FadeInWhenVisible>
      <FadeInWhenVisible><VideoDemo /></FadeInWhenVisible>

      {/* Testimonials */}
      <FadeInWhenVisible>
        <Testimonials />
      </FadeInWhenVisible>

      {/* Blog Section */}
      <FadeInWhenVisible>
        <BlogSection />
      </FadeInWhenVisible>

      <FadeInWhenVisible><PricingPlans theme={theme} currency={currency} /></FadeInWhenVisible>

      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 flex justify-center">
          <FadeInWhenVisible>
            <RegisterComplexForm />
          </FadeInWhenVisible>
        </div>
      </section>

      <FadeInWhenVisible><ContactSection /></FadeInWhenVisible>
    </div>
  );
}