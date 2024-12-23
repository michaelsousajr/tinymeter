import React, { useState } from 'react';
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
  const [theme, setTheme] = useState<'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave' | 'pink'>('pink');
  const [visualizer, setVisualizer] = useState<VisualizerType>('waveform');
  const [showWelcome, setShowWelcome] = useState(true);

  const handlePopout = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popoutWindow = window.open(
      '/',
      'TinyMeter',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popoutWindow) {
      const popoutContent = `
        <html>
          <head>
            <title>tinymeter</title>
            <style>
              body { 
                margin: 0; 
                padding: 0;
                background: ${theme === 'pink' ? '#FF69B4' : '#222222'};
                overflow: hidden;
              }
              #meter {
                width: 100%;
                height: 100vh;
              }
            </style>
          </head>
          <body>
            <div id="meter"></div>
            <script>
              const meter = document.getElementById('meter');
              const canvas = document.createElement('canvas');
              canvas.style.width = '100%';
              canvas.style.height = '100%';
              meter.appendChild(canvas);
              
              // Copy audio context and analyzer from parent window
              const parentMeter = window.opener.document.querySelector('canvas');
              const ctx = canvas.getContext('2d');
              
              function copyCanvas() {
                if (parentMeter && ctx) {
                  canvas.width = parentMeter.width;
                  canvas.height = parentMeter.height;
                  ctx.drawImage(parentMeter, 0, 0);
                }
                requestAnimationFrame(copyCanvas);
              }
              
              copyCanvas();
            </script>
          </body>
        </html>
      `;

      popoutWindow.document.write(popoutContent);
      popoutWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-meter-bg text-white p-8 pb-20" style={{ 
      background: theme === 'pink' ? '#FF69B4' : undefined 
    }}>
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