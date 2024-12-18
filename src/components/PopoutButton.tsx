import React from 'react';
import { Maximize2 } from 'lucide-react';

interface PopoutButtonProps {
  onPopout: () => void;
}

export const PopoutButton = ({ onPopout }: PopoutButtonProps) => {
  return (
    <button
      onClick={onPopout}
      className="p-2 rounded-lg bg-meter-bg hover:bg-opacity-80 transition-all duration-300"
    >
      <Maximize2 className="w-5 h-5 text-meter-accent1" />
    </button>
  );
};