import React from 'react';

interface PeakLUFSVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
}

export const PeakLUFSVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
}: PeakLUFSVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Calculate peak value
  const peak = Math.max(...Array.from(dataArray)) / 255;
  
  // Calculate LUFS (simplified approximation)
  const lufs = -23 + (peak * 23); // Simplified LUFS calculation
  
  // Draw peak meter
  ctx.fillStyle = themeColors[theme].primary;
  ctx.fillRect(0, height - peak * height, width / 2 - 5, peak * height);
  
  // Draw LUFS meter
  ctx.fillStyle = themeColors[theme].accent;
  const lufsHeight = Math.abs(lufs) / 23 * height;
  ctx.fillRect(width / 2 + 5, height - lufsHeight, width / 2 - 5, lufsHeight);
  
  // Draw labels
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.fillText(`Peak: ${(peak * 100).toFixed(1)}%`, 10, 20);
  ctx.fillText(`LUFS: ${lufs.toFixed(1)}`, width / 2 + 15, 20);
};