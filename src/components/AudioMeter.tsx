import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface AudioMeterProps {
  theme?: 'default' | 'neon' | 'vintage';
  className?: string;
}

export const AudioMeter = ({ theme = 'default', className }: AudioMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const themeColors = {
    default: {
      primary: '#00ff95',
      secondary: '#222222',
      accent: '#ffffff',
    },
    neon: {
      primary: '#ff3366',
      secondary: '#222222',
      accent: '#00ffff',
    },
    vintage: {
      primary: '#ffae00',
      secondary: '#222222',
      accent: '#ff6b6b',
    },
  };

  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      draw();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const drawFrame = () => {
      animationFrameRef.current = requestAnimationFrame(drawFrame);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = themeColors[theme].secondary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    drawFrame();
  };

  useEffect(() => {
    initAudio();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "w-full h-64 rounded-lg bg-meter-bg transition-all duration-300",
        className
      )}
      width={1024}
      height={256}
    />
  );
};