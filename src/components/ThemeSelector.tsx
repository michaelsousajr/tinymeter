import React from 'react';
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: 'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave') => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { id: 'default', name: 'Default', color: 'bg-meter-accent1' },
    { id: 'neon', name: 'Neon', color: 'bg-meter-accent2' },
    { id: 'vintage', name: 'Vintage', color: 'bg-meter-accent3' },
    { id: 'purple', name: 'Purple', color: 'bg-[#9b87f5]' },
    { id: 'soft', name: 'Soft', color: 'bg-[#F2FCE2]' },
    { id: 'wave', name: 'Wave', color: 'bg-[#0EA5E9]' },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id as 'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave')}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-300",
            theme.color,
            currentTheme === theme.id ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
          )}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};