import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  theme: 'magenta' | 'ocean' | 'sunset' | 'pink';
}

export const Footer = ({ theme }: FooterProps) => {
  const getGradientClass = () => {
    const gradients = {
      magenta: 'from-meter-magenta-primary to-meter-magenta-secondary',
      ocean: 'from-meter-ocean-primary to-meter-ocean-secondary',
      sunset: 'from-meter-sunset-primary to-meter-sunset-secondary',
      pink: 'from-meter-pink-primary to-meter-pink-secondary'
    };
    return gradients[theme];
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-meter-bg/80 backdrop-blur-sm">
      <div className={`max-w-4xl mx-auto flex flex-col items-center justify-center gap-4`}>
        <span className={`bg-gradient-to-r ${getGradientClass()} bg-clip-text text-transparent font-medium`}>
          Made with <Heart className="inline-block w-4 h-4 text-red-500" /> by MS
        </span>
        <div className="flex gap-4 text-sm text-gray-400">
          <a href="https://yoursite.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Personal Site</a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://ko-fi.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Ko-fi</a>
        </div>
      </div>
    </footer>
  );
};