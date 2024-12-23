import React, { useState } from 'react';
import { AudioMeter } from '@/components/AudioMeter';
import { PopoutButton } from '@/components/PopoutButton';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Footer } from '@/components/Footer';
import { ThemeType } from '@/types/theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type VisualizerType = 'spectrogram' | 'waveform' | 'spectrum' | 'stereometer' | 'peaklufs' | 'oscilloscope';

const Index = () => {
  const [theme, setTheme] = useState<ThemeType>('pink');
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
              body { 
                margin: 0; 
                padding: 20px;
                background: #0F0F1A;
                overflow: hidden;
              }
              #meter {
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              canvas {
                width: 100%;
                height: 100%;
                border-radius: 12px;
              }
            </style>
          </head>
          <body>
            <div id="meter"></div>
            <script>
              const meter = document.getElementById('meter');
              const canvas = document.createElement('canvas');
              meter.appendChild(canvas);
              
              const parentCanvas = window.opener.document.querySelector('canvas');
              const ctx = canvas.getContext('2d');
              
              function copyCanvas() {
                if (parentCanvas && ctx) {
                  canvas.width = parentCanvas.width;
                  canvas.height = parentCanvas.height;
                  ctx.drawImage(parentCanvas, 0, 0);
                }
                requestAnimationFrame(copyCanvas);
              }
              
              copyCanvas();

              window.opener.addEventListener('unload', () => window.close());
            </script>
          </body>
        </html>
      `);
      popoutWindow.document.close();
    }
  };

  return (
    <div className={`min-h-screen text-white p-8 pb-20 bg-meter-${theme}-bg`}>
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
          <h1 className={`text-4xl font-bold tracking-tight bg-gradient-to-r from-meter-${theme}-primary to-meter-${theme}-secondary bg-clip-text text-transparent`}>
            tinymeter
          </h1>
          <PopoutButton onPopout={handlePopout} />
        </div>

        <div className="space-y-4 relative">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <AudioMeter
            theme={theme}
            visualizer={visualizer}
            className="h-96 animate-meter-noise"
            onThemeChange={setTheme}
          />
        </div>
      </div>
      <Footer theme={theme} />
    </div>
  );
};

export default Index;
