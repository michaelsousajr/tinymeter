import React from 'react';

interface WaveformVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  channels?: ('left' | 'right' | 'mid' | 'side')[];
  colorMode?: 'static' | 'multiband';
  showPeakHistory?: boolean;
  speed?: number;
}

export const WaveformVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
  channels = ['mid'],
  colorMode = 'static',
  showPeakHistory = true,
  speed = 1
}: WaveformVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  const sliceWidth = width / dataArray.length * speed;
  
  // Draw waveform
  ctx.beginPath();
  ctx.strokeStyle = themeColors[theme].primary;
  ctx.lineWidth = 2;
  
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * height) / 2;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  
  // Draw peak history if enabled
  if (showPeakHistory) {
    const peakHeight = Math.max(...Array.from(dataArray)) / 255 * height;
    ctx.strokeStyle = themeColors[theme].accent;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, height - peakHeight);
    ctx.lineTo(width, height - peakHeight);
    ctx.stroke();
    ctx.setLineDash([]);
  }
};