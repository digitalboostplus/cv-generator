import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface MacWindowProps {
  text: string;
  isDarkTheme?: boolean;
  typingSpeed?: number;
  className?: string;
}

export const MacWindow: React.FC<MacWindowProps> = ({
  text,
  isDarkTheme = false,
  typingSpeed = 50,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Window appearance animation
    const windowAnimation = anime({
      targets: containerRef.current,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
      complete: () => setIsVisible(true),
    });

    // Cleanup
    return () => {
      windowAnimation.pause();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !textRef.current) return;

    // Split text into characters
    const characters = text.split('');
    textRef.current.innerHTML = '';
    
    // Create span for each character
    characters.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      textRef.current?.appendChild(span);
    });

    // Typing animation
    const typingAnimation = anime({
      targets: textRef.current.querySelectorAll('span'),
      opacity: [0, 1],
      duration: typingSpeed,
      easing: 'linear',
      delay: anime.stagger(typingSpeed),
    });

    // Cursor animation
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    textRef.current.appendChild(cursor);

    const cursorAnimation = anime({
      targets: cursor,
      opacity: [1, 0],
      duration: 600,
      easing: 'steps(2)',
      loop: true,
    });

    // Cleanup
    return () => {
      typingAnimation.pause();
      cursorAnimation.pause();
    };
  }, [isVisible, text, typingSpeed]);

  return (
    <div
      ref={containerRef}
      className={`opacity-0 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`rounded-lg shadow-xl overflow-hidden ${
          isDarkTheme ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Window Header */}
        <div
          className={`px-4 py-2 flex items-center ${
            isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Window Content */}
        <div
          className={`p-6 font-mono text-sm ${
            isDarkTheme ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          <div ref={textRef} className="whitespace-pre-wrap" />
        </div>
      </div>

      <style jsx>{`
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: ${isDarkTheme ? '#e5e7eb' : '#1f2937'};
          margin-left: 2px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}; 