"use client";

import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

const FadeInWhenVisible: FC<FadeInWhenVisibleProps> = ({
  children,
  delay = 0,
  duration = 0.5,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWhenVisible;
