import React from 'react';

interface SpectrumVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  mode?: 'fft' | 'color' | 'both';
  showFrequency?: boolean;
}

export const SpectrumVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
  mode = 'both',
  showFrequency = true
}: SpectrumVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Create gradient with proper color values and fallbacks
  const gradient = ctx.createLinearGradient(0, height, 0, 0);
  const defaultColors = {
    primary: '#FF69B4',
    secondary: '#9333EA'
  };
  
  const colors = themeColors[theme] || defaultColors;
  
  // Add noise effect
  const noise = Math.random() * 0.1;
  const primaryWithNoise = adjustColorBrightness(colors.primary, noise);
  const secondaryWithNoise = adjustColorBrightness(colors.secondary, noise);
  
  gradient.addColorStop(0, primaryWithNoise);
  gradient.addColorStop(1, secondaryWithNoise);
  
  ctx.fillStyle = gradient;
  
  const barWidth = width / dataArray.length;
  let peakFrequency = 0;
  let peakAmplitude = 0;
  
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * height;
    
    if (dataArray[i] > peakAmplitude) {
      peakAmplitude = dataArray[i];
      peakFrequency = i * (44100 / dataArray.length);
    }
    
    // Add slight randomness to bar heights for noise effect
    const noiseHeight = barHeight * (1 + (Math.random() - 0.5) * 0.1);
    ctx.fillRect(i * barWidth, height - noiseHeight, barWidth, noiseHeight);
  }
  
  if (showFrequency && peakFrequency > 0) {
    ctx.fillStyle = colors.primary;
    ctx.font = '14px monospace';
    ctx.fillText(`Peak: ${Math.round(peakFrequency)}Hz`, 10, 20);
  }
};

// Helper function to adjust color brightness
function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) * (1 + amount)));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) * (1 + amount)));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) * (1 + amount)));
  
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}