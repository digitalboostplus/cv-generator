import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface LoadingWindowProps {
  isDarkTheme?: boolean;
}

export const LoadingWindow: React.FC<LoadingWindowProps> = ({ isDarkTheme = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<anime.AnimeInstance[]>([]);

  useEffect(() => {
    if (!containerRef.current || !glowRef.current) return;

    try {
      // Window entrance animation
      const entranceAnimation = anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutCubic',
      });

      // Rotation and scale animation
      const windowAnimation = anime({
        targets: containerRef.current,
        rotateY: [0, 360],
        scale: [1, 1.1, 1],
        duration: 3000,
        loop: true,
        easing: 'easeInOutQuad',
        direction: 'alternate',
        delay: 300, // Start after entrance animation
      });

      // Glow animation with multiple colors
      const glowAnimation = anime({
        targets: glowRef.current,
        opacity: [0.4, 0.8],
        scale: [1, 1.2],
        duration: 1500,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
        background: isDarkTheme 
          ? ['rgba(79, 70, 229, 0.4)', 'rgba(99, 102, 241, 0.6)']  // Indigo colors
          : ['rgba(59, 130, 246, 0.4)', 'rgba(96, 165, 250, 0.6)'], // Blue colors
      });

      // Gradient animation with smoother transitions
      const gradientAnimation = anime({
        targets: containerRef.current.querySelector('.window-body'),
        background: [
          isDarkTheme 
            ? ['linear-gradient(45deg, #1f2937, #374151)', 'linear-gradient(225deg, #111827, #1f2937)']
            : ['linear-gradient(45deg, #f3f4f6, #ffffff)', 'linear-gradient(225deg, #ffffff, #e5e7eb)'],
        ],
        duration: 2000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
      });

      // Store animations for cleanup
      animationsRef.current = [
        entranceAnimation,
        windowAnimation,
        glowAnimation,
        gradientAnimation,
      ];

      // Cleanup function
      return () => {
        animationsRef.current.forEach(animation => {
          if (animation && animation.pause) {
            animation.pause();
          }
        });
      };
    } catch (error) {
      console.error('Error initializing animations:', error);
      // Fallback to static appearance if animations fail
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
    }
  }, [isDarkTheme]);

  return (
    <div className="relative w-48 h-48 mx-auto my-8">
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`absolute inset-0 rounded-2xl ${
          isDarkTheme ? 'bg-indigo-500' : 'bg-blue-400'
        } blur-xl opacity-40 -z-10 transition-colors duration-300`}
      />

      {/* Window container */}
      <div
        ref={containerRef}
        className="relative w-full h-full opacity-0"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className={`w-full h-full rounded-xl shadow-2xl overflow-hidden transform-gpu transition-colors duration-300`}>
          {/* Window header */}
          <div
            className={`px-3 py-2 flex items-center ${
              isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
            } transition-colors duration-300`}
          >
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>

          {/* Window body with gradient */}
          <div
            className="window-body w-full h-full p-4 transition-colors duration-300"
            style={{
              background: isDarkTheme
                ? 'linear-gradient(45deg, #1f2937, #374151)'
                : 'linear-gradient(45deg, #f3f4f6, #ffffff)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className={`animate-pulse ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-600'
              } transition-colors duration-300`}>
                Generating...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 