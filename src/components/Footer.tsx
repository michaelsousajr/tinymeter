import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-meter-bg/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
        <span>Made with <Heart className="inline-block w-4 h-4 text-meter-accent2" /> by MS</span>
        <div className="flex gap-4">
          <a href="https://yoursite.com" target="_blank" rel="noopener noreferrer" className="hover:text-meter-accent1 transition-colors">Personal Site</a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-meter-accent1 transition-colors">Instagram</a>
          <a href="https://ko-fi.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-meter-accent1 transition-colors">Ko-fi</a>
        </div>
      </div>
    </footer>
  );
};