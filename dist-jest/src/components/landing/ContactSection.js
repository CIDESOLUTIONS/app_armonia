import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'next-i18next';
import { ContactForm } from '@/components/landing/ContactForm'; // Assuming ContactForm component is already there
import { FadeIn } from '@/components/animations/FadeIn';
export function ContactSection() {
    const { t } = useTranslation('landing');
    return (_jsx(FadeIn, { delay: 0.2, children: _jsx("section", { className: "py-20 bg-indigo-600 text-white", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: t('contact.title') }), _jsx("p", { className: "text-xl mb-12", children: t('contact.description') }), _jsx(ContactForm, {})] }) }) }));
}
