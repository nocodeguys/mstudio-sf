import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  blurAmount?: number;
}

export default function MotionSection({
  children,
  className = '',
  delay = 0, 
  duration = 0.7,
  once = true,
  blurAmount = 4
}: MotionSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      filter: `blur(${blurAmount}px)`
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay,
        opacity: { duration: duration * 1.2, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: duration * 1.5, ease: [0.22, 1, 0.36, 1] },
        y: { duration: duration * 1.3, ease: [0.16, 1, 0.3, 1] }
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.section>
  );
} 