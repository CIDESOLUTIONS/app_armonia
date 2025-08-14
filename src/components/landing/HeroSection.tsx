'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';

const images = [
  '/images/landing-hero.png',
  '/images/landing-hero1.png',
  '/images/landing-hero2.png',
  '/images/landing-hero3.png',
  '/images/landing-hero4.png',
];

export const HeroSection = () => {
  const { t } = useTranslation('landing');
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[95vh] min-h-[700px] flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={t('hero.imageAlt', { index: index + 1 })}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <FadeIn delay={0.2}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-shadow-lg">
            {t('hero.title', 'Armonía')}
          </h1>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="max-w-3xl text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 text-shadow-md">
            {t(
              'hero.subtitle',
              'El ecosistema operativo para la propiedad horizontal. Unifique la gestión, comunicación y seguridad en una sola plataforma.'
            )}
          </p>
        </FadeIn>
        <FadeIn delay={0.6}>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-lg px-8 py-6"
              onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.ctaPrimary', 'Solicitar Demo')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-black/20 border-white/50 hover:bg-white/10 hover:text-white"
               onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.ctaSecondary', 'Ver Planes')}
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};