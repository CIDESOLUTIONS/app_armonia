import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ui/section-card.tsx
import { motion } from 'framer-motion';
export function SectionCard({ title, children, className = '' }) {
    return (_jsxs(motion.section, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`, children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: title }), children] }));
}
