import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'next-i18next';
import { Plans } from '@/components/landing/Plans'; // Assuming Plans component is already there
import { FadeIn } from '@/components/animations/FadeIn';
export function PricingPlans() {
    const { t } = useTranslation('landing');
    return (_jsx(FadeIn, { delay: 0.4, children: _jsx("section", { className: "py-20 bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-4", children: t('pricing.title') }), _jsx("p", { className: "text-xl text-gray-600 mb-12", children: t('pricing.description') }), _jsx(Plans, {})] }) }) }));
}
