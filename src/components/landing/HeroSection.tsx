"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("landing");
  const images = [
    "/images/landing-hero.png",
    "/images/landing-hero1.png",
    "/images/landing-hero2.png",
    "/images/landing-hero3.png",
    "/images/landing-hero4.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Hero Image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          priority={index === 0} // Carga la primera imagen con prioridad
          className={`transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center p-4">
        <div className="z-10 text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in-up animation-delay-200">
            {t("hero.subtitle")}
          </p>
          <div className="space-x-4 animate-fade-in-up animation-delay-400">
            <Link href="/auth/register" passHref>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
                {t("hero.ctaPrimary")}
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button
                variant="outline"
                className="text-white border-white text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}