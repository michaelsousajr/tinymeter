import React from 'react';

interface OscilloscopeVisualizerProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dataArray: Uint8Array;
  theme: string;
  themeColors: any;
  followPitch?: boolean;
  cycle: 'multi' | 'single';
}

export const OscilloscopeVisualizer = ({
  ctx,
  canvas,
  dataArray,
  theme,
  themeColors,
  followPitch = true,
  cycle = 'multi'
}: OscilloscopeVisualizerProps) => {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.strokeStyle = themeColors[theme].primary;
  ctx.lineWidth = 2;

  const sliceWidth = width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * height / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();
};
