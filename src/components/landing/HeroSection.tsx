import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <FadeIn>
      <section className="relative pt-24 pb-20 bg-white text-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href={ROUTES.LOGIN} passHref>
                  <Button size="lg" className="w-full sm:w-auto">
                    {t("hero.loginButton")}
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER_COMPLEX} passHref>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {t("hero.registerButton")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/landing-hero.png"
                  alt="Dashboard Preview"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl border border-gray-200"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-md flex items-center space-x-2">
                  <Check className="text-green-500" size={20} />
                  <span className="text-sm font-medium">
                    {t("hero.dashboardPreview")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
