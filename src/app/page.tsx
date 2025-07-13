"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { MainFeatures } from "@/components/landing/MainFeatures";
import { FeaturesOverview } from "@/components/landing/FeaturesOverview";
import { VideoDemo } from "@/components/landing/VideoDemo";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { Testimonials } from "@/components/landing/Testimonials";
import { BlogSection } from "@/components/landing/BlogSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Suspense } from "react";

const LandingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroSection />
      <FeaturesOverview />
      <MainFeatures />
      <VideoDemo />
      <PricingPlans />
      <Testimonials />
      <BlogSection />
      <ContactSection />
    </Suspense>
  );
};

export default LandingPage;
