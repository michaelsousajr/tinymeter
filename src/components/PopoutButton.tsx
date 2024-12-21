import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PopoutButtonProps {
  onPopout: () => void;
}

export const PopoutButton = ({ onPopout }: PopoutButtonProps) => {
  return (
    <button
      onClick={onPopout}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1A1F2C] hover:bg-opacity-80 transition-all duration-300"
      aria-label="Open in new window"
    >
      <ExternalLink className="w-5 h-5 text-meter-accent1" />
    </button>
  );
};