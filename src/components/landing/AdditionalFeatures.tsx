import React from 'react';
import { useTranslation } from 'next-i18next';
import { Users, MessageSquare, Shield } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function AdditionalFeatures() {
  const { t } = useTranslation('landing');

  return (
    <FadeIn delay={0.2}>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            Más Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Users className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('features.resident.title')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('features.resident.description')}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <MessageSquare className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('features.pqr.title')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('features.pqr.description')}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Shield className="text-indigo-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('features.reception.title')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('features.reception.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
