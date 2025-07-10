import React from 'react';
import { useTranslation } from 'next-i18next';
import { FadeIn } from '@/components/animations/FadeIn';

export function VideoDemo() {
  const { t } = useTranslation('landing');

  return (
    <FadeIn delay={0.4}>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('video.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {t('video.description')}
          </p>
          <div className="relative w-full max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden">
            <video
              className="w-full"
              controls
              src="/videos/landing-video.mp4"
              poster="/images/landing-hero4.png"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
