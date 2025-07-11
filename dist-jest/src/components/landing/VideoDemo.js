import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'next-i18next';
import { FadeIn } from '@/components/animations/FadeIn';
export function VideoDemo() {
    const { t } = useTranslation('landing');
    return (_jsx(FadeIn, { delay: 0.4, children: _jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-4", children: t('video.title') }), _jsx("p", { className: "text-xl text-gray-600 mb-12", children: t('video.description') }), _jsx("div", { className: "relative w-full max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden", children: _jsx("video", { className: "w-full", controls: true, src: "/videos/landing-video.mp4", poster: "/images/landing-hero4.png", children: "Tu navegador no soporta la etiqueta de video." }) })] }) }) }));
}
