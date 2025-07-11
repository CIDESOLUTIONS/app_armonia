"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const FadeInWhenVisible = ({ children, delay = 0, duration = 0.5 }) => {
    return (_jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, transition: { duration, delay }, variants: {
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
        }, children: children }));
};
export default FadeInWhenVisible;
