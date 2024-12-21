import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PopoutButtonProps {
  onPopout: () => void;
}

export const PopoutButton = ({ onPopout }: PopoutButtonProps) => {
  return (
    <button
      onClick={onPopout}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F2C] hover:bg-opacity-80 transition-all duration-300"
      aria-label="Open in new window"
    >
      <ExternalLink className="w-5 h-5 text-meter-accent1" />
      <span className="text-white text-sm">Popout</span>
    </button>
  );
};