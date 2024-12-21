import React from 'react';

interface SpectrumVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  mode?: 'fft' | 'color' | 'both';
  smoothing?: number;
  channel?: 'left' | 'right' | 'mid' | 'side';
  showFrequency?: boolean;
}

export const SpectrumVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
  mode = 'both',
  smoothing = 0.8,
  channel = 'mid',
  showFrequency = true
}: SpectrumVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Draw frequency spectrum
  const barWidth = width / dataArray.length;
  const gradient = ctx.createLinearGradient(0, height, 0, 0);
  gradient.addColorStop(0, themeColors[theme].primary);
  gradient.addColorStop(1, themeColors[theme].accent);
  
  ctx.fillStyle = gradient;
  
  // Find peak frequency for readout
  let peakFrequency = 0;
  let peakAmplitude = 0;
  
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * height;
    
    if (dataArray[i] > peakAmplitude) {
      peakAmplitude = dataArray[i];
      peakFrequency = i * (44100 / dataArray.length); // Approximate frequency
    }
    
    ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
  }
  
  // Show frequency readout if enabled
  if (showFrequency && peakFrequency > 0) {
    ctx.fillStyle = themeColors[theme].accent;
    ctx.font = '14px monospace';
    ctx.fillText(`Peak: ${Math.round(peakFrequency)}Hz`, 10, 20);
  }
};