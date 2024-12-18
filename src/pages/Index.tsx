import React, { useState } from 'react';
import { AudioMeter } from '@/components/AudioMeter';
import { PopoutButton } from '@/components/PopoutButton';
import { ThemeSelector } from '@/components/ThemeSelector';

const Index = () => {
  const [theme, setTheme] = useState<'default' | 'neon' | 'vintage'>('default');

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
            <title>TinyMeter</title>
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
                      gradient.addColorStop(0, '#00ff95');
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
    <div className="min-h-screen bg-meter-bg text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            TinyMeter
          </h1>
          <PopoutButton onPopout={handlePopout} />
        </div>
        
        <div className="space-y-4">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <AudioMeter theme={theme} className="h-96" />
        </div>
        
        <p className="text-sm text-gray-400 text-center">
          Click the expand button to open in a separate window
        </p>
      </div>
    </div>
  );
};

export default Index;