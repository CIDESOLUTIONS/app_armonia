import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/landing/BlogSection.tsx
import Image from 'next/image';
import Link from 'next/link';
const blogPosts = [
    {
        title: '5 consejos para una gestión de asambleas más eficiente',
        excerpt: 'Descubra cómo la tecnología puede optimizar sus asambleas, desde la convocatoria hasta la generación de actas.',
        imageUrl: '/images/blog/post1.png',
        link: '/blog/gestion-asambleas'
    },
    {
        title: 'La importancia de la comunicación en un conjunto residencial',
        excerpt: 'Explore estrategias y herramientas para fortalecer la comunicación entre administradores, residentes y personal.',
        imageUrl: '/images/blog/post2.png',
        link: '/blog/comunicacion-efectiva'
    },
    {
        title: 'Cómo optimizar las finanzas de su conjunto con Armonía',
        excerpt: 'Aprenda a utilizar las herramientas financieras de Armonía para un manejo transparente y eficiente de los recursos.',
        imageUrl: '/images/blog/post3.png',
        link: '/blog/finanzas-transparentes'
    }
];
export const BlogSection = () => {
    return (_jsx("section", { className: "py-20 bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-gray-900", children: "Nuestro Blog" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Mant\u00E9ngase informado con nuestros \u00FAltimos art\u00EDculos y consejos sobre administraci\u00F3n de conjuntos residenciales." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: blogPosts.map((post, index) => (_jsxs("div", { className: "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all", children: [_jsx("div", { className: "relative h-48 w-full", children: _jsx(Image, { src: post.imageUrl, alt: `Imagen para ${post.title}`, layout: "fill", objectFit: "cover" }) }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold mb-3 text-gray-900", children: post.title }), _jsx("p", { className: "text-gray-600 mb-4", children: post.excerpt }), _jsx(Link, { href: post.link, className: "text-indigo-600 hover:text-indigo-800 font-medium", children: "Leer m\u00E1s" })] })] }, index))) })] }) }));
};
