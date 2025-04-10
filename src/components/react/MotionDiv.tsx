import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MotionDivProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  blurAmount?: number;
}

export default function MotionDiv({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  once = true,
  direction = 'up',
  distance = 15,
  blurAmount = 4
}: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  const variants = {
    hidden: { 
      opacity: 0,
      filter: `blur(${blurAmount}px)`,
      ...getDirectionOffset()
    },
    visible: { 
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        opacity: { duration: duration * 1.2, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: duration * 1.5, ease: [0.22, 1, 0.36, 1] },
        x: { duration: duration * 1.3, ease: [0.16, 1, 0.3, 1] },
        y: { duration: duration * 1.3, ease: [0.16, 1, 0.3, 1] },
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
} 