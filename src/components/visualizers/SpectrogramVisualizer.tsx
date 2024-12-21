import React from 'react';

interface SpectrogramVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  orientation?: 'horizontal' | 'vertical';
  mode?: 'sharp' | 'classic';
  curve?: 'linear' | 'logarithmic';
  brightnessBoost?: number;
}

export const SpectrogramVisualizer = ({ 
  ctx, 
  canvas, 
  dataArray, 
  theme, 
  themeColors,
  orientation = 'horizontal',
  mode = 'sharp',
  curve = 'linear',
  brightnessBoost = 1.0
}: SpectrogramVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  // Create image data
  const imageData = ctx.createImageData(width, 1);
  const data = imageData.data;
  
  // Process frequency data
  for (let i = 0; i < dataArray.length; i++) {
    const value = dataArray[i] * brightnessBoost;
    const index = i * 4;
    
    // Convert frequency data to color based on theme
    const color = themeColors[theme].primary;
    const rgb = hexToRgb(color);
    
    if (rgb) {
      data[index] = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = value; // Alpha based on amplitude
    }
  }
  
  // Shift existing spectrogram down
  ctx.drawImage(canvas, 
    0, 0, width, height - 1,  // Source rectangle
    0, 1, width, height - 1   // Destination rectangle
  );
  
  // Draw new line at top
  ctx.putImageData(imageData, 0, 0);
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};