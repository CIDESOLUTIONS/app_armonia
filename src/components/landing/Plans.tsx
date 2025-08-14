'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// This would typically be in your i18n files, but defined here for clarity.
const translations = {
  es: {
    title: 'Planes diseñados para cada comunidad',
    description: 'Desde pequeñas comunidades hasta grandes portafolios, tenemos un plan que se ajusta a tus necesidades.',
    monthly: 'Mensual',
    yearly: 'Anual (2 meses gratis)',
    perMonth: 'mes',
    cta: {
      basic: 'Empezar Gratis',
      standard: 'Elegir Plan Estándar',
      premium: 'Elegir Plan Premium',
      enterprise: 'Contactar Ventas',
      democracy: 'Solicitar Información',
    },
    plans: {
      basic: {
        name: 'Básico (Freemium)',
        price: 'Gratis',
        description: 'Para comunidades pequeñas que inician su digitalización.',
        features: [
          'Gestión de inventario de inmuebles',
          'Sistema de PQR (Peticiones, Quejas, Reclamos)',
          'Cartelera digital y comunicados',
          'Encuestas y votaciones simples',
          'Hasta 40 unidades residenciales',
        ],
      },
      standard: {
        name: 'Estándar',
        badge: 'Más Popular',
        price: { monthly: 95000, yearly: 950000 },
        description: 'La solución ideal para la mayoría de conjuntos residenciales.',
        features: [
          'Todo lo del Plan Básico',
          'Módulo de Reservas de amenidades',
          'Módulo Financiero (sin conciliación)',
          'Gestión Avanzada de Visitantes con QR',
          'Recepción y notificación de paquetería',
          'Hasta 150 unidades residenciales',
        ],
      },
      premium: {
        name: 'Premium',
        price: { monthly: 190000, yearly: 1900000 },
        description: 'Para administraciones que buscan la máxima eficiencia y valor.',
        features: [
          'Todo lo del Plan Estándar',
          'Conciliación Bancaria Automática',
          'Marketplace Comunitario',
          'Directorio de Servicios para el Hogar',
          'Módulo de Democracia Digital integrado',
          'Acceso a API para integraciones',
          'Más de 150 unidades residenciales',
        ],
      },
      enterprise: {
        name: 'Empresarial (Portafolio)',
        price: 'Personalizado',
        description: 'Para empresas que administran múltiples propiedades y requieren marca blanca.',
        features: [
          'Todas las funcionalidades del Plan Premium',
          'Dashboard Multi-Propiedad consolidado',
          'Gestión centralizada de propiedades',
          'Informes consolidados del portafolio',
          'Personalización de marca (White-Labeling)',
          'Soporte técnico prioritario',
        ],
      },
      democracy: {
        name: 'Democracia Digital',
        price: 'Por Evento',
        description: 'Contrata nuestro módulo de asambleas como un servicio independiente.',
        features: [
          'Plataforma para asambleas virtuales o híbridas',
          'Registro de asistencia y quórum en tiempo real',
          'Sistema de votaciones ponderadas por coeficiente',
          'Generación automática de borrador del acta',
          'Soporte técnico durante el evento',
        ],
      },
    },
  },
  // ...en translations would go here
};

const PlanCard = ({ plan, isYearly, currency, t }) => {
  const isPopular = plan.badge;
  const price = typeof plan.price === 'object' ? (isYearly ? plan.price.yearly : plan.price.monthly) : plan.price;
  const ctaMap = {
    'Básico (Freemium)': t('cta.basic'),
    'Estándar': t('cta.standard'),
    'Premium': t('cta.premium'),
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg p-8 flex flex-col relative border',
        isPopular ? 'border-indigo-500 border-2' : 'border-gray-200'
      )}
    >
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="bg-indigo-500 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase flex items-center gap-1">
            <Star className="w-4 h-4" />
            {plan.badge}
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <p className="text-gray-500 mb-6 h-12">{plan.description}</p>
      <div className="mb-6">
        <span className="text-5xl font-extrabold text-gray-900">
          {typeof price === 'number'
            ? price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
            : price}
        </span>
        {typeof price === 'number' && (
          <span className="text-lg text-gray-500">/{t('perMonth')}</span>
        )}
      </div>
      <ul className="text-left text-gray-600 space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button size="lg" className={cn(isPopular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900', 'w-full text-white')}>
        {ctaMap[plan.name]}
      </Button>
    </div>
  );
};

const SpecialPlanCard = ({ plan, t }) => (
  <div className="bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col text-white border border-gray-700">
    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
    <p className="text-gray-400 mb-6 flex-grow">{plan.description}</p>
    <div className="mb-6">
      <span className="text-4xl font-extrabold">{plan.price}</span>
    </div>
    <ul className="text-left text-gray-300 space-y-3 mb-8">
      {plan.features.map((feature, i) => (
        <li key={i} className="flex items-start">
          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button size="lg" variant="outline" className="w-full bg-transparent border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white">
      {plan.name === t('plans.enterprise.name') ? t('cta.enterprise') : t('cta.democracy')}
    </Button>
  </div>
);

export function Plans() {
  const [isYearly, setIsYearly] = useState(false);
  // Using the hardcoded translations for now.
  const t = (key, fallback) => {
    const keys = key.split('.');
    let result = translations.es;
    for (const k of keys) {
      result = result[k];
      if (!result) return fallback || key;
    }
    return result;
  };

  const mainPlans = [t('plans.basic'), t('plans.standard'), t('plans.premium')];
  const specialPlans = [t('plans.enterprise'), t('plans.democracy')];

  return (
    <section id="pricing" className="py-20 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">{t('description')}</p>

        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={cn('font-medium', !isYearly ? 'text-indigo-600' : 'text-gray-500')}>{t('monthly')}</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={cn('font-medium', isYearly ? 'text-indigo-600' : 'text-gray-500')}>{t('yearly')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isYearly={isYearly} t={t} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {specialPlans.map((plan) => (
            <SpecialPlanCard key={plan.name} plan={plan} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}