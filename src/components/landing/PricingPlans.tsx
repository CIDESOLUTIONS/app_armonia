'use client';
import React from "react";
import { useTranslations } from "next-intl";
import { Plans } from "@/components/landing/Plans"; // Assuming Plans component is already there
import { FadeIn } from "@/components/animations/FadeIn";

export function PricingPlans() {
  const t = useTranslations("landing");

  return (
    <FadeIn delay={0.4}>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {t("pricing.description")}
          </p>
          <Plans />
        </div>
      </section>
    </FadeIn>
  );
}