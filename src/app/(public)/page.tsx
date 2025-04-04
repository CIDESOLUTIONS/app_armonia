"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/context/AuthContext';
import {  
  Calendar, DollarSign, Building, Users,  
  Mail, Shield, Phone, Home,  
  BarChart, MessageSquare  
} from 'lucide-react'; 
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';

interface FormData { 
  complexName: string; 
  totalUnits: string; 
  adminName: string; 
  adminEmail: string; 
  adminPassword: string; 
}

interface Feature { 
  icon: JSX.Element; 
  title: string; 
  description: string; 
}

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, adminName } = useAuth();
  const [formData, setFormData] = useState<FormData>({ 
    complexName: '', 
    totalUnits: '', 
    adminName: '', 
    adminEmail: '', 
    adminPassword: '', 
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('Español');
  const [theme, setTheme] = useState('Claro');
  const [currency, setCurrency] = useState('Pesos');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const images = [
    '/images/landing-hero.png',
    '/images/landing-hero1.png',
    '/images/landing-hero2.png',
    '/images/landing-hero3.png',
    '/images/landing-hero4.png',
  ];

  const features: Feature[] = [
    { 
      icon: <Home className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' 
        ? 'Gestión de Inventario de Inmuebles, Dueños, Mascotas y Vehículos' 
        : 'Property, Owner, Pet, and Vehicle Inventory Management',
      description: language === 'Español'
        ? 'Identificación clara de todos los integrantes de la comunidad.'
        : 'Manage vehicles and pets.'
    },
    {
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Asambleas' : 'Assembly Management',
      description: language === 'Español'  
        ? 'Organiza y gestiona las reuniones de asambleas con facilidad.'
        : 'Easily organize and manage assemblies.'
    },
    {
      icon: <DollarSign className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Presupuestos y Proyectos' : 'Budget and Project Management',
      description: language === 'Español'
        ? 'Controla las finanzas, proyectos comunitarios y cuotas.'
        : 'Control community finances, projects and fees.'
    },
    {
      icon: <Building className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Servicios Comunes' : 'Common Services Management',
      description: language === 'Español'
        ? 'Administra áreas y servicios compartidos del conjunto.'
        : 'Manage shared areas and services.'
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Residentes y Visitantes' : 'Residents and Visitors Management',
      description: language === 'Español'
        ? 'Registra residentes y visitantes.'
        : 'Register residents and visitors.'
    },
    {
      icon: <Mail className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Correspondencia' : 'Mail Management',
      description: language === 'Español'
        ? 'Controla envíos y entregas.'
        : 'Control shipments and deliveries.'
    },
    {
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestión de Seguridad' : 'Security Management',
      description: language === 'Español'
        ? 'Garantiza la seguridad con tecnología.'
        : 'Ensure safety with technology.'
    },
    {
      icon: <Phone className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Citofonía Virtual' : 'Virtual Intercom',
      description: language === 'Español'
        ? 'Comunícate con citofonía virtual.'
        : 'Communicate with virtual intercom.'
    },
    {
      icon: <BarChart className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Reportes Financieros' : 'Financial Reports',
      description: language === 'Español'
        ? 'Genera reportes detallados.'
        : 'Generate detailed reports.'
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
      title: language === 'Español' ? 'Gestion de PQRs con Residentes' : 'Managing PQRs with Residents',
      description: language === 'Español'
        ? 'Mejora la comunicación y atención de peticiones, quejas y reclamos de los residentes'
        : 'Improves communication and attention to requests, complaints and claims from residents'
    },
  ];

  // Detectar cliente y cambiar intervalos de imágenes
  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Manejar redirección cuando el usuario está autenticado
  useEffect(() => {
    console.log('[LandingPage] Estado de autenticación:', isLoggedIn);
    console.log('[LandingPage] Estado de carga:', authLoading);
    
    // Solo redirigir cuando terminó la carga de autenticación y el usuario está autenticado
    if (!authLoading && isLoggedIn && !isRedirecting) {
      console.log('[LandingPage] Usuario autenticado, preparando redirección...');
      setIsRedirecting(true);
      
      // Pequeño retraso para evitar redirecciones inmediatas
      const redirectTimer = setTimeout(() => {
        console.log('[LandingPage] Redirigiendo a dashboard...');
        router.push(ROUTES.DASHBOARD);
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoggedIn, authLoading, router]);

  // Si está cargando la autenticación o redirigiendo, mostrar un estado de carga
  if (authLoading || (isLoggedIn && isRedirecting)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-indigo-600 text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-600/30"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoggedIn ? 'Redirigiendo al dashboard...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  const validateForm = (): string | null => {
    if (!formData.complexName || 
        !formData.totalUnits || 
        !formData.adminName || 
        !formData.adminEmail || 
        !formData.adminPassword) {
      return language === 'Español'
        ? 'Por favor, completa todos los campos requeridos.'
        : 'Please fill in all required fields.';
    }

    const totalUnitsNum = parseInt(formData.totalUnits);
    if (isNaN(totalUnitsNum) || totalUnitsNum <= 0) {
      return language === 'Español'
        ? 'El total de inmuebles debe ser un número mayor a 0.'
        : 'Total units must be a number greater than 0.';
    }

    if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      return language === 'Español'
        ? 'Ingresa un email válido.'
        : 'Enter a valid email.';
    }

    if (formData.adminPassword.length < 6) {
      return language === 'Español'
        ? 'La contraseña debe tener al menos 6 caracteres.'
        : 'Password must be at least 6 characters long.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const dataToSend = {
      complexName: formData.complexName,
      totalUnits: parseInt(formData.totalUnits),
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
    };

    try {
      console.log('[LandingPage] Enviando datos de registro:', dataToSend.complexName);
      
      const response = await fetch('/api/register-complex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al registrar el conjunto');
      }

      setSuccess(
        language === 'Español'
          ? '¡Registro exitoso! Redirigiendo al login...'
          : 'Registration successful! Redirecting to login...'
      );

      console.log('[LandingPage] Registro exitoso, redirigiendo en 2 segundos...');
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('[LandingPage] Error en registro:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const renderFeatures = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-start space-x-4"
        >
          <div className="flex-shrink-0 mt-1">{feature.icon}</div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-white">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const pricing = currency === 'Pesos' ? '$20.000 COP' : '5 USD';

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'Claro' ? 'bg-gray-50' : 'bg-gray-900'}`}>
    {isClient && (
      <Header
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        isLoggedIn={isLoggedIn}
        adminName={adminName || ''}
      />
    )}
    
    <div className="h-16" />
    
    <main className="flex-1 mt-16 px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Sección de características */}
        <div className="lg:flex-[2] flex flex-col">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'Español' ? 'Nuestro Propósito' : 'Our Purpose'}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-white pr-12 lg:pr-16">
              {language === 'Español'
                ? "Gestión Integral para tu Comunidad, Armonía es una solución diseñada para simplificar y modernizar la gestión de conjuntos residenciales. Con una interfaz intuitiva y herramientas avanzadas, optimiza la administración para consejos y administradores."
                : "Comprehensive Community Management, Armonía is a solution designed to simplify and modernize the management of residential complexes. With an intuitive interface and advanced tools, it optimizes administration for councils and administrators."}
            </p>
          </motion.div>
          
          {renderFeatures()}
        </div>

        {/* Sección de registro */}
        <div className="lg:w-1/3 w-full flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-48 sm:h-64 overflow-hidden rounded-lg shadow-md"
          >
            <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt="Community management"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full"
          >
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400">
              {language === 'Español' ? 'Comienza Ahora' : 'Get Started Now'}
            </h3>
            <p className="text-center text-sm text-gray-600 dark:text-white mb-4">
              {language === 'Español'
                ? `Por solo ${pricing} por residencia. ¡Prueba gratis por 2 meses hasta 25 inmuebles!`
                : `For just ${pricing} per residence. Free trial for 2 months up to 25 properties!`}
            </p>
            
            {isClient && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'Español' ? 'Nombre del Conjunto' : 'Complex Name'}
                  </label>
                  <Input
                    type="text"
                    value={formData.complexName}
                    onChange={(e) => setFormData({ ...formData, complexName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="off"
                    className="mt-1 block w-full"
                    data-cy="complex-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'Español' ? 'Total de Inmuebles' : 'Total Units'}
                  </label>
                  <Input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                    required
                    disabled={loading}
                    min="1"
                    className="mt-1 block w-full"
                    data-cy="total-units"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'Español' ? 'Nombre Completo del Administrador' : 'Admin Full Name'}
                  </label>
                  <Input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="off"
                    className="mt-1 block w-full"
                    data-cy="admin-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'Español' ? 'Email del Administrador' : 'Admin Email'}
                  </label>
                  <Input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="off"
                    className="mt-1 block w-full"
                    data-cy="admin-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'Español' ? 'Contraseña' : 'Password'}
                  </label>
                  <Input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="mt-1 block w-full"
                    data-cy="admin-password"
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center" data-cy="error-message">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center" data-cy="success-message">{success}</p>}
                
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={loading}
                  data-cy="register-submit"
                >
                  {loading 
                    ? (language === 'Español' ? 'Procesando...' : 'Processing...') 
                    : (language === 'Español' ? 'Crear Cuenta de Prueba' : 'Create Trial Account')}
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'Español' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}{' '}
                    <button
                      type="button"
                      onClick={() => router.push(ROUTES.LOGIN)}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      {language === 'Español' ? 'Iniciar sesión' : 'Login'}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>

    <footer className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-48 object-cover rounded-lg shadow-md"
          src="/videos/landing-video.mp4"
        />
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Armonía - {language === 'Español' ? 'Todos los derechos reservados' : 'All rights reserved'}
        </p>
      </div>
    </footer>
  </div>
);
}