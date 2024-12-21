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
            <canvas id="popoutCanvas"></canvas>
            <script>
              const canvas = document.getElementById('popoutCanvas');
              const ctx = canvas.getContext('2d');
              
              async function initAudio() {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  const audioContext = new AudioContext();
                  const analyser = audioContext.createAnalyser();
                  const source = audioContext.createMediaStreamSource(stream);
                  
                  source.connect(analyser);
                  analyser.fftSize = 256;
                  
                  function draw() {
                    requestAnimationFrame(draw);
                    
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    analyser.getByteFrequencyData(dataArray);
                    
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    
                    ctx.fillStyle = '#222222';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    const barWidth = canvas.width / bufferLength * 2.5;
                    let x = 0;
                    
                    for (let i = 0; i < bufferLength; i++) {
                      const barHeight = (dataArray[i] / 255) * canvas.height;
                      
                      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                      gradient.addColorStop(0, '${theme === 'default' ? '#00ff95' : 
                                            theme === 'neon' ? '#ff3366' : 
                                            theme === 'vintage' ? '#ffae00' : 
                                            theme === 'purple' ? '#9b87f5' : 
                                            theme === 'soft' ? '#F2FCE2' : 
                                            '#0EA5E9'}');
                      gradient.addColorStop(1, '#ffffff');
                      
                      ctx.fillStyle = gradient;
                      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                      
                      x += barWidth + 1;
                    }
                  }
                  
                  draw();
                } catch (error) {
                  console.error('Error:', error);
                }
              }
              
              initAudio();
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
        </div>
        
        <div className="space-y-4 relative">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <div className="relative">
            <AudioMeter theme={theme} visualizer={visualizer} className="h-96" />
            <div className="absolute top-4 right-4">
              <PopoutButton onPopout={handlePopout} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;