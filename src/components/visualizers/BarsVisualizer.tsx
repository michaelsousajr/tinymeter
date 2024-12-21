import React from 'react';

interface BarsVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  bufferLength: number;
  theme: string;
  themeColors: any;
}

export const BarsVisualizer = ({ ctx, canvas, dataArray, bufferLength, theme, themeColors }: BarsVisualizerProps) => {
  const barWidth = canvas.width / bufferLength * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * canvas.height;
    
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
    gradient.addColorStop(0, themeColors[theme].primary);
    gradient.addColorStop(1, themeColors[theme].accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    
    x += barWidth + 1;
  }
};