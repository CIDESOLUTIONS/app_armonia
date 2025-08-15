"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";

// TODO: Reemplazar los videos placeholder cuando los assets finales estén disponibles.
// La especificación requiere videos para: acceso QR, asambleas, pagos, reservas y marketplace.
const videoFeatures = [
  {
    key: "qrAccess",
    videoSrc: "/videos/landing-video.mp4",
  },
  {
    key: "assemblies",
    videoSrc: "/videos/landing-video.mp4",
  },
  {
    key: "payments",
    videoSrc: "/videos/landing-video.mp4",
  },
  {
    key: "reservations",
    videoSrc: "/videos/landing-video.mp4",
  },
  {
    key: "marketplace",
    videoSrc: "/videos/landing-video.mp4",
  },
];

export function VideoDemo() {
  const { t } = useTranslation("landing");
  const [activeFeature, setActiveFeature] = useState(videoFeatures[0]);

  return (
    <FadeIn delay={0.4}>
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("video.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            {t("video.description")}
          </p>
          <div className="relative w-full max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden mb-8">
            <video
              key={activeFeature.key} // Forzar el rerender del video al cambiar
              className="w-full"
              controls
              autoPlay
              muted
              loop
              src={activeFeature.videoSrc}
              poster="/images/landing-hero4.png"
            >
              {t("video.fallback")}
            </video>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {videoFeatures.map((feature) => (
              <Button
                key={feature.key}
                variant={
                  activeFeature.key === feature.key ? "default" : "outline"
                }
                onClick={() => setActiveFeature(feature)}
                className="transition-all duration-200"
              >
                {t(`video.features.${feature.key}`)}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
