// src/components/animations/FadeIn.tsx
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export const FadeIn = ({ children, className, delay = 0 }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // La animación solo se ejecuta una vez
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
    });
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    return (_jsx(motion.div, { ref: ref, className: className, variants: variants, initial: "hidden", animate: inView ? 'visible' : 'hidden', transition: { duration: 0.5, delay }, children: children }));
};
