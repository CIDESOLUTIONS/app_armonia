import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/landing/Testimonials.tsx
import Image from 'next/image';
const testimonials = [
    {
        name: 'Ana García',
        role: 'Administradora, Conjunto El Roble',
        avatar: '/images/avatars/ana.png',
        testimonial: '"Armonía ha transformado nuestra gestión. La comunicación con los residentes es más fluida y hemos ahorrado incontables horas en tareas administrativas."'
    },
    {
        name: 'Carlos Martínez',
        role: 'Miembro del Consejo, Residencial Los Pinos',
        avatar: '/images/avatars/carlos.png',
        testimonial: '"La función de asambleas virtuales es excepcional. Tuvimos una participación récord y la toma de decisiones fue transparente y eficiente."'
    },
    {
        name: 'Lucía Fernández',
        role: 'Residente, Torres del Parque',
        avatar: '/images/avatars/lucia.png',
        testimonial: '"Reservar el salón comunal y pagar la administración desde mi celular es increíblemente cómodo. ¡La app es muy fácil de usar!"'
    }
];
export const Testimonials = () => {
    return (_jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-gray-900", children: "Lo que dicen nuestros clientes" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Descubra por qu\u00E9 administradores y residentes conf\u00EDan en Armon\u00EDa." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: testimonials.map((item, index) => (_jsxs("div", { className: "bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center", children: [_jsx("div", { className: "w-24 h-24 mb-4 relative", children: _jsx(Image, { src: item.avatar, alt: `Avatar de ${item.name}`, layout: "fill", className: "rounded-full" }) }), _jsx("p", { className: "text-gray-600 mb-4 italic", children: item.testimonial }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: item.name }), _jsx("p", { className: "text-indigo-600", children: item.role })] }, index))) })] }) }));
};
