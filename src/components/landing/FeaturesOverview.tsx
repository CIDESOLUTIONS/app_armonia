"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Building, Users, DollarSign } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function FeaturesOverview() {
  const { t } = useTranslation("landing");

  return (
    <FadeIn delay={0.2}>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("features.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {t("features.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <Building className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("features.inventory.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.inventory.description")}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <Users className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("features.communications.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.communications.description")}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <DollarSign className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("features.finances.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("features.finances.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
