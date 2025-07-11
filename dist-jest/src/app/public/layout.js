import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '@/components/layout/header';
export const metadata = {
    title: 'Armonía | Gestión Integral de Conjuntos Residenciales',
    description: 'Plataforma líder para la administración de conjuntos residenciales. Gestiona finanzas, asambleas, comunicación y seguridad en un solo lugar.',
    keywords: ['administración de conjuntos', 'software para conjuntos', 'gestión de propiedades', 'asambleas virtuales', 'app para residentes']
};
export default function PublicLayout({ children, }) {
    const handleLanguageChange = (language) => { };
    const handleThemeChange = (theme) => { };
    const handleCurrencyChange = (currency) => { };
    return (_jsxs("div", { className: "public-layout", children: [_jsx(Header, { theme: "Claro", setTheme: handleThemeChange, language: "Espa\u00F1ol", setLanguage: handleLanguageChange, currency: "Pesos", setCurrency: handleCurrencyChange, isLoggedIn: false }), _jsx("div", { className: "pt-16", children: children })] }));
}
