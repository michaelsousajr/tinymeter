import React from 'react';

interface CircleVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
}

export const CircleVisualizer = ({ ctx, canvas, dataArray, theme, themeColors }: CircleVisualizerProps) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = themeColors[theme].primary;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Create dynamic circle based on audio data
  const avgAmplitude = Array.from(dataArray).reduce((a, b) => a + b, 0) / dataArray.length;
  const dynamicRadius = radius + (avgAmplitude / 255) * 50;

  ctx.beginPath();
  ctx.arc(centerX, centerY, dynamicRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = themeColors[theme].accent;
  ctx.lineWidth = 1;
  ctx.stroke();
};