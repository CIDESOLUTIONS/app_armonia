import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function MainFeatures() {
  const t = useTranslations("landing");

  return (
    <FadeIn delay={0.4}>
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Inventory */}
          <div className="flex flex-col lg:flex-row items-center mb-20">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("features.inventory.title")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {t("features.inventory.description")}
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.inventory.feature1")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.inventory.feature2")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.inventory.feature3")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.inventory.feature4")}
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/images/landing-hero1.png"
                alt="Inventory Management"
                width={700}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Assemblies */}
          <div className="flex flex-col lg:flex-row-reverse items-center mb-20">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("features.assemblies.title")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {t("features.assemblies.description")}
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.assemblies.feature1")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.assemblies.feature2")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.assemblies.feature3")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.assemblies.feature4")}
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/images/landing-hero2.png"
                alt="Assembly Management"
                width={700}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Financial */}
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("features.finances.title")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {t("features.finances.description")}
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.finances.feature1")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.finances.feature2")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.finances.feature3")}
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  {t("features.finances.feature4")}
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/images/landing-hero3.png"
                alt="Financial Management"
                width={700}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
