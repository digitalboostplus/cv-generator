'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const demoTexts = [
  "Creating a professional CV for Upwork...",
  "Optimizing content for LinkedIn profile...",
  "Formatting resume for Fiverr gigs...",
  "Adjusting layout for Indeed applications...",
  "Tailoring experience for Freelancer.com..."
];

export function CVTransformDemo() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typeText = (text: string, currentIndex = 0) => {
    if (currentIndex <= text.length) {
      setDisplayText(text.slice(0, currentIndex));
      typingTimeoutRef.current = setTimeout(() => {
        typeText(text, currentIndex + 1);
      }, 50);
    } else {
      typingTimeoutRef.current = setTimeout(() => {
        const backspace = (length: number) => {
          if (length >= 0) {
            setDisplayText(text.slice(0, length));
            typingTimeoutRef.current = setTimeout(() => {
              backspace(length - 1);
            }, 30);
          } else {
            setCurrentTextIndex((prev) => (prev + 1) % demoTexts.length);
          }
        };
        backspace(text.length);
      }, 2000);
    }
  };

  useEffect(() => {
    typeText(demoTexts[currentTextIndex]);

    // Animate cursor
    anime({
      targets: cursorRef.current,
      opacity: [1, 0],
      duration: 800,
      easing: 'steps(2)',
      loop: true
    });

    // Different animations based on currentTextIndex
    const animations = [
      // Animation 1: Horizontal to Vertical transformation
      () => {
        return anime.timeline({
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutQuart',
          duration: 4000
        }).add({
          targets: '.preview-container',
          scaleX: [1, 0.7],
          scaleY: [1, 1.4],
          duration: 3000,
          easing: 'easeInOutElastic(1, .6)'
        });
      },
      // Animation 2: Spin and Color Change
      () => {
        return anime.timeline({
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutQuart',
          duration: 4000
        }).add({
          targets: '.preview-container',
          rotateZ: [0, 360],
          duration: 3000,
          easing: 'easeInOutBack'
        }).add({
          targets: '.cv-section',
          backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(100,100,255,0.2)', 'rgba(255,255,255,0.1)'],
          duration: 2000
        }, '-=3000');
      },
      // Animation 3: Glow and Rise
      () => {
        return anime.timeline({
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutQuart',
          duration: 4000
        }).add({
          targets: '.preview-container',
          translateY: [0, -30],
          boxShadow: [
            '0 0 0 rgba(255,255,255,0)',
            '0 0 50px rgba(255,255,255,0.3)',
            '0 0 100px rgba(255,255,255,0.2)'
          ],
          duration: 2000,
          easing: 'easeInOutQuad'
        });
      },
      // Animation 4: Wave Effect
      () => {
        return anime.timeline({
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutQuart',
          duration: 4000
        }).add({
          targets: '.cv-section',
          translateX: anime.stagger(20, {from: 'center', axis: 'x'}),
          translateY: anime.stagger(10, {from: 'center', axis: 'y'}),
          rotateZ: anime.stagger([-5, 5]),
          delay: anime.stagger(100),
          duration: 2000,
          easing: 'easeInOutSine'
        });
      },
      // Animation 5: Pulse and Morph
      () => {
        return anime.timeline({
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutQuart',
          duration: 4000
        }).add({
          targets: '.preview-container',
          borderRadius: ['1rem', '3rem', '1rem'],
          scale: [1, 1.05, 1],
          duration: 2000,
          easing: 'easeInOutElastic(1, .6)'
        });
      }
    ];

    const currentAnimation = animations[currentTextIndex]();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      currentAnimation.pause();
    };
  }, [currentTextIndex]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16" ref={containerRef}>
      {/* Input Field */}
      <div className="relative w-full">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="w-full bg-white/5 backdrop-blur-sm rounded-full px-6 py-4 border border-white/10">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-white/80">{displayText}</span>
            <div ref={cursorRef} className="ml-1 w-0.5 h-5 bg-white/80"></div>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div 
        ref={previewRef}
        className="preview-container relative w-full aspect-video bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 overflow-hidden transition-shadow duration-1000"
      >
        {/* CV Sections */}
        <div className="cv-section w-full h-8 bg-white/10 rounded-lg mb-4 transition-colors duration-500"></div>
        <div className="cv-section w-3/4 h-32 bg-white/5 rounded-lg mb-4 p-4 transition-colors duration-500">
          <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-2/3 h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-white/10 rounded"></div>
        </div>
        <div className="cv-section w-full h-48 bg-white/5 rounded-lg p-4 transition-colors duration-500">
          <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-3/4 h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
          <div className="w-2/3 h-4 bg-white/10 rounded"></div>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i}
              className="border border-white/5"
            />
          ))}
        </div>

        {/* Measurement Lines */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-[2px] bg-white/30"></div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-[2px] bg-white/30"></div>
        <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 w-[2px] h-4 bg-white/30"></div>
        <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-[2px] h-4 bg-white/30"></div>
      </div>
    </div>
  );
} 