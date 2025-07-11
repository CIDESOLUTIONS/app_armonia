import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { Check } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { FadeIn } from '@/components/animations/FadeIn';
export function HeroSection() {
    const router = useRouter();
    const { t } = useTranslation('landing');
    return (_jsx(FadeIn, { children: _jsx("section", { className: "relative pt-24 pb-20 bg-white text-gray-800 overflow-hidden", children: _jsx("div", { className: "container mx-auto px-4 relative z-10", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between", children: [_jsxs("div", { className: "lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0", children: [_jsx("h1", { className: "text-5xl lg:text-6xl font-extrabold leading-tight mb-6", children: t('hero.title') }), _jsx("p", { className: "text-lg lg:text-xl text-gray-600 mb-8", children: t('hero.description') }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4", children: [_jsx("button", { onClick: () => router.push(ROUTES.LOGIN), className: "bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-lg", children: t('hero.loginButton') }), _jsx("button", { onClick: () => router.push(ROUTES.REGISTER_COMPLEX), className: "bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition duration-300 shadow-lg", children: t('hero.registerButton') })] })] }), _jsx("div", { className: "lg:w-1/2 flex justify-center lg:justify-end", children: _jsxs("div", { className: "relative w-full max-w-lg", children: [_jsx(Image, { src: "/images/landing-hero.png", alt: "Dashboard Preview", width: 800, height: 600, className: "rounded-lg shadow-xl border border-gray-200" }), _jsxs("div", { className: "absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-md flex items-center space-x-2", children: [_jsx(Check, { className: "text-green-500", size: 20 }), _jsx("span", { className: "text-sm font-medium", children: t('hero.dashboardPreview') })] })] }) })] }) }) }) }));
}
