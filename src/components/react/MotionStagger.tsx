import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MotionStaggerProps {
  children: React.ReactNode;
  className?: string;
  containerTag?: 'div' | 'ul' | 'ol';
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  once?: boolean;
  blurAmount?: number;
}

export default function MotionStagger({
  children,
  className = '',
  containerTag = 'div',
  staggerDelay = 0.08,
  initialDelay = 0.2,
  duration = 0.7,
  once = true,
  blurAmount = 3
}: MotionStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  };
  
  const item = {
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
        opacity: { duration: duration * 1.2, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: duration * 1.5, ease: [0.22, 1, 0.36, 1] },
        y: { duration: duration * 1.3, ease: [0.16, 1, 0.3, 1] }
      }
    }
  };
  
  // Create the appropriate motion container based on containerTag
  const StaggerContainer = containerTag === 'ul' 
    ? motion.ul 
    : containerTag === 'ol' 
      ? motion.ol 
      : motion.div;

  // Clone children and wrap them in motion divs
  const enhancedChildren = React.Children.map(children, (child) => (
    <motion.div variants={item} style={{ willChange: "transform, opacity, filter" }}>{child}</motion.div>
  ));

  return (
    <StaggerContainer
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={container}
    >
      {enhancedChildren}
    </StaggerContainer>
  );
} 