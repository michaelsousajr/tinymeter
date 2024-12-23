import React from 'react';
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: 'magenta' | 'ocean' | 'sunset' | 'pink') => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { id: 'magenta', name: 'Magenta', gradient: 'bg-gradient-to-r from-meter-magenta-primary to-meter-magenta-secondary' },
    { id: 'ocean', name: 'Ocean', gradient: 'bg-gradient-to-r from-meter-ocean-primary to-meter-ocean-secondary' },
    { id: 'sunset', name: 'Sunset', gradient: 'bg-gradient-to-r from-meter-sunset-primary to-meter-sunset-secondary' },
    { id: 'pink', name: 'Pink', gradient: 'bg-gradient-to-r from-meter-pink-primary to-meter-pink-secondary' },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id as 'magenta' | 'ocean' | 'sunset' | 'pink')}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-300",
            theme.gradient,
            currentTheme === theme.id ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
          )}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};