'use client';

import { useState } from 'react';
import { MacWindow } from '@/components/MacWindow';

export default function DemoPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const demoText = `// Welcome to the MacWindow Demo!
import { happiness } from 'life';

function createMagic() {
  return {
    animation: 'awesome',
    style: 'elegant',
    impact: 'memorable'
  };
}

// Let's make something amazing...
const magic = createMagic();
console.log('✨ Magic created:', magic);`;

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              MacWindow Animation Demo
            </h1>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`px-4 py-2 rounded-lg ${
                isDarkTheme
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-900 text-white'
              } transition-colors duration-200`}
            >
              Toggle Theme
            </button>
          </div>

          <MacWindow
            text={demoText}
            isDarkTheme={isDarkTheme}
            typingSpeed={40}
            className="transform hover:scale-[1.02] transition-transform duration-200"
          />

          <div className={`mt-8 p-6 rounded-lg ${
            isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
          }`}>
            <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
            <p className="mb-4">
              This demo showcases a Mac-style window with a typing animation effect
              powered by Anime.js. The window features:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Realistic Mac window appearance</li>
              <li>Smooth typing animation</li>
              <li>Blinking cursor effect</li>
              <li>Dark/Light theme support</li>
              <li>Elegant entrance animation</li>
              <li>Hover scaling effect</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 