import React, { useState, useEffect } from 'react';
import { AudioMeter } from '@/components/AudioMeter';
import { PopoutButton } from '@/components/PopoutButton';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Footer } from '@/components/Footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type VisualizerType = 'spectrogram' | 'waveform' | 'spectrum' | 'stereometer' | 'peaklufs' | 'oscilloscope';

const Index = () => {
  const [theme, setTheme] = useState<'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave'>('default');
  const [visualizer, setVisualizer] = useState<VisualizerType>('spectrum');
  const [showWelcome, setShowWelcome] = useState(true);

  const handlePopout = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popoutWindow = window.open(
      '',
      'TinyMeter',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popoutWindow) {
      popoutWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>tinymeter</title>
            <style>
              body { margin: 0; background: #222222; overflow: hidden; }
              canvas { width: 100%; height: 100vh; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              import { createRoot } from 'react-dom/client';
              import { AudioMeter } from './components/AudioMeter';
              
              const root = createRoot(document.getElementById('root'));
              root.render(
                <AudioMeter 
                  theme="${theme}" 
                  visualizer="${visualizer}"
                  className="h-screen"
                />
              );
            </script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-meter-bg text-white p-8 pb-20">
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to tinymeter</DialogTitle>
            <DialogDescription>
              A minimal audio visualization tool for your music and sounds. 
              Choose your audio source, select a theme, and watch the magic happen. 
              You can even pop out the visualizer into a separate window!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            tinymeter
          </h1>
          <PopoutButton onPopout={handlePopout} />
        </div>
        
        <div className="space-y-4 relative">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <AudioMeter 
            theme={theme} 
            visualizer={visualizer} 
            className="h-96" 
            onThemeChange={setTheme}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;