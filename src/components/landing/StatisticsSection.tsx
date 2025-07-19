import React from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/animations/FadeIn";

export function StatisticsSection() {
  const t = useTranslations("landing");

  return (
    <FadeIn delay={0.2}>
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-12">
            Armonía en Números
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                +500
              </div>
              <p className="text-gray-700">
                {t("statistics.complexesManaged")}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                +10,000
              </div>
              <p className="text-gray-700">
                {t("statistics.satisfiedResidents")}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl font-bold text-indigo-600 mb-2">98%</div>
              <p className="text-gray-700">
                {t("statistics.userSatisfaction")}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                -30%
              </div>
              <p className="text-gray-700">{t("statistics.timeReduction")}</p>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}