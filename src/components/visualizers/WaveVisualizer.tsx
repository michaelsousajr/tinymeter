import React from 'react';

interface WaveVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  bufferLength: number;
  theme: string;
  themeColors: any;
}

export const WaveVisualizer = ({ ctx, canvas, dataArray, bufferLength, theme, themeColors }: WaveVisualizerProps) => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = themeColors[theme].primary;
  ctx.lineWidth = 2;
  ctx.stroke();
};