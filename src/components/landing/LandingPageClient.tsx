"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Testimonials } from "@/components/landing/Testimonials";
import { BlogSection } from "@/components/landing/BlogSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesOverview } from "@/components/landing/FeaturesOverview";
import { MainFeatures } from "@/components/landing/MainFeatures";
import { AdditionalFeatures } from "@/components/landing/AdditionalFeatures";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { VideoDemo } from "@/components/landing/VideoDemo";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { ContactSection } from "@/components/landing/ContactSection";
import { FadeInWhenVisible } from "@/components/animations/FadeInWhenVisible";
import { RegisterComplexForm } from "@/components/landing/RegisterComplexForm";

export default function LandingPageClient() {
  const _router = useRouter();
  const [currency, setCurrency] = useState("Pesos");

  const handleLanguageChange = (lang: string) => {
    console.log(`Language change to ${lang} not implemented yet.`);
  };

  return (
    <div
      className={`flex flex-col min-h-screen overflow-hidden`}
    >
      {/* Header */}
      <Header
        language={"Español"}
        setLanguage={handleLanguageChange}
        currency={currency}
        setCurrency={setCurrency}
      />

      <FadeInWhenVisible>
        <HeroSection />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <FeaturesOverview />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <MainFeatures />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <AdditionalFeatures />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <StatisticsSection />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <VideoDemo />
      </FadeInWhenVisible>

      {/* Testimonials */}
      <FadeInWhenVisible>
        <Testimonials />
      </FadeInWhenVisible>

      {/* Blog Section */}
      <FadeInWhenVisible>
        <BlogSection />
      </FadeInWhenVisible>

      <FadeInWhenVisible>
        <PricingPlans currency={currency} />
      </FadeInWhenVisible>

      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 flex justify-center">
          <FadeInWhenVisible>
            <RegisterComplexForm />
          </FadeInWhenVisible>
        </div>
      </section>

      <FadeInWhenVisible>
        <ContactSection />
      </FadeInWhenVisible>
    </div>
  );
}
