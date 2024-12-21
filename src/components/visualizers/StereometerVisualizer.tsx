import React from 'react';

interface StereometerVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  mode: 'logarithmic' | 'linear' | 'lissajous';
  colorMode: 'static' | 'rgb' | 'multiband';
}

export const StereometerVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
  mode = 'logarithmic',
  colorMode = 'static'
}: StereometerVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Draw stereo meter
  const leftChannel = dataArray.slice(0, dataArray.length / 2);
  const rightChannel = dataArray.slice(dataArray.length / 2);
  
  const leftAvg = leftChannel.reduce((a, b) => a + b, 0) / leftChannel.length;
  const rightAvg = rightChannel.reduce((a, b) => a + b, 0) / rightChannel.length;
  
  // Draw left channel
  ctx.fillStyle = themeColors[theme].primary;
  ctx.fillRect(0, height / 2, (leftAvg / 255) * width / 2, height / 4);
  
  // Draw right channel
  ctx.fillStyle = themeColors[theme].accent;
  ctx.fillRect(width / 2, height / 2, (rightAvg / 255) * width / 2, height / 4);
};