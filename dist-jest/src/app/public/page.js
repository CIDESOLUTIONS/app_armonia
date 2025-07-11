"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Testimonials } from '@/components/landing/Testimonials';
import { BlogSection } from '@/components/landing/BlogSection';
// Importar los nuevos componentes de sección
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesOverview } from '@/components/landing/FeaturesOverview';
import { MainFeatures } from '@/components/landing/MainFeatures';
import { AdditionalFeatures } from '@/components/landing/AdditionalFeatures';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { PricingPlans } from '@/components/landing/PricingPlans';
import { ContactSection } from '@/components/landing/ContactSection';
// Componente de animación
const FadeIn = ({ children, delay = 0 }) => {
    return (_jsx("div", { style: { animation: `fadeIn 1s ease-in-out ${delay}s forwards`, opacity: 0 }, children: children }));
};
export const metadata = {
    title: 'Armonía - Gestión Inteligente de Conjuntos Residenciales',
    description: 'Transforma la administración de tu conjunto residencial con Armonía. Plataforma todo-en-uno para finanzas, asambleas, seguridad, y comunicación.',
    keywords: ['administración de condominios', 'software para conjuntos residenciales', 'gestión de propiedades', 'asambleas virtuales', 'seguridad residencial'],
};
export default function LandingPage() {
    const router = useRouter();
    const [currency, setCurrency] = useState("Pesos");
    const [theme, setTheme] = useState("Claro");
    // Aplicar configuraciones
    useEffect(() => {
        if (theme === "Oscuro") {
            document.body.classList.add("dark-theme");
        }
        else {
            document.body.classList.remove("dark-theme");
        }
    }, [theme]);
    const handleLanguageChange = (lang) => {
        console.log(`Language change to ${lang} not implemented yet.`);
    };
    return (_jsxs("div", { className: `flex flex-col min-h-screen overflow-hidden ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`, children: [_jsx(Header, { theme: theme, setTheme: setTheme, language: "Español", setLanguage: handleLanguageChange, currency: currency, setCurrency: setCurrency }), _jsx(FadeInWhenVisible, { children: _jsx(HeroSection, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(FeaturesOverview, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(MainFeatures, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(AdditionalFeatures, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(StatisticsSection, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(VideoDemo, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(Testimonials, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(BlogSection, {}) }), _jsx(FadeInWhenVisible, { children: _jsx(PricingPlans, { theme: theme, currency: currency }) }), _jsx("section", { className: "py-16 md:py-24 bg-gray-50 dark:bg-gray-800", children: _jsx("div", { className: "container mx-auto px-4 flex justify-center", children: _jsx(FadeInWhenVisible, { children: _jsx(RegisterComplexForm, {}) }) }) }), _jsx(FadeInWhenVisible, { children: _jsx(ContactSection, {}) })] }));
}
