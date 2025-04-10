import React, { useEffect, useRef } from 'react';

interface HeroMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  blurAmount?: number;
}

export default function HeroMotion({
  children,
  className = '',
  delay = 0.1,
  staggerDelay = 0.08,
  duration = 0.9,
  blurAmount = 2.5
}: HeroMotionProps) {
  // Flag to ensure the animation only runs once
  const hasAnimated = useRef(false);

  // Store animation parameters in refs to avoid dependency issues
  const animParamsRef = useRef({ delay, staggerDelay, duration, blurAmount });

  // A stable reference to the timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update animation params when props change
  useEffect(() => {
    animParamsRef.current = { delay, staggerDelay, duration, blurAmount };
  }, [delay, staggerDelay, duration, blurAmount]);

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set initial opacity to 0 for elements we want to animate
  useEffect(() => {
    if (hasAnimated.current) return;

    // Only set initial styles once
    const titleElements = document.querySelectorAll('.hero-title');
    const subtitleElements = document.querySelectorAll('.hero-subtitle');
    const imageElements = document.querySelectorAll('.hero-image');
    const ctaElements = document.querySelectorAll('.hero-cta');

    // Set initial styles
    const setHiddenStyle = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(15px)';
          el.style.filter = `blur(${animParamsRef.current.blurAmount}px)`;
          el.style.transition = 'none';
        }
      });
    };

    setHiddenStyle(titleElements);
    setHiddenStyle(subtitleElements);
    setHiddenStyle(imageElements);
    setHiddenStyle(ctaElements);

    // Force a reflow to ensure styles are applied before animations
    document.body.offsetHeight;

    // Flag that we've set initial styles
    hasAnimated.current = true;

    // Start animation sequence after a short delay to ensure initial styles are applied
    setTimeout(() => {
      startAnimationSequence();
    }, 50);
  }, []);

  // Separate function to start the animation sequence
  const startAnimationSequence = () => {
    // Get current animation parameters
    const { delay, staggerDelay, duration, blurAmount } = animParamsRef.current;

    // Helper function to animate elements with a delay
    const animateElements = (selector: string, delayTime: number, customDuration: number) => {
      const timer = setTimeout(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.transition = `
              opacity ${customDuration}s cubic-bezier(0.16, 1, 0.3, 1), 
              transform ${customDuration}s cubic-bezier(0.16, 1, 0.3, 1), 
              filter ${customDuration * 1.2}s cubic-bezier(0.16, 1, 0.3, 1)
            `;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.filter = 'blur(0px)';
          }
        });
      }, delayTime * 1000);

      return timer;
    };

    // Animate title first
    const titleTimer = animateElements('.hero-title', delay, duration);
    
    // Animate subtitle second
    const subtitleTimer = animateElements('.hero-subtitle', delay + staggerDelay * 3, duration * 0.9);
    
    // Animate image third
    const imageTimer = animateElements('.hero-image', delay + staggerDelay * 6, duration * 1.1);
    
    // Animate CTA buttons last
    const ctaTimer = animateElements('.hero-cta', delay + staggerDelay * 9, duration * 0.8);

    // Store the last timer
    timeoutRef.current = ctaTimer;
  };

  return (
    <div 
      className={className}
      style={{ 
        width: '100%',
        willChange: 'transform, opacity, filter'
      }}
    >
      {children}
    </div>
  );
} 