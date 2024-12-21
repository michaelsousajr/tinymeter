import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Volume2, VolumeX } from 'lucide-react';
import { BarsVisualizer } from './visualizers/BarsVisualizer';
import { WaveVisualizer } from './visualizers/WaveVisualizer';
import { CircleVisualizer } from './visualizers/CircleVisualizer';

interface AudioMeterProps {
  theme?: 'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave';
  visualizer?: 'bars' | 'wave' | 'circle';
  className?: string;
}

export const AudioMeter = ({ theme = 'default', visualizer = 'bars', className }: AudioMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [currentVisualizer, setCurrentVisualizer] = useState(visualizer);

  const themeColors = {
    default: {
      primary: '#00ff95',
      secondary: '#1A1F2C',
      accent: '#ffffff',
    },
    neon: {
      primary: '#ff3366',
      secondary: '#1A1F2C',
      accent: '#00ffff',
    },
    vintage: {
      primary: '#ffae00',
      secondary: '#1A1F2C',
      accent: '#ff6b6b',
    },
    purple: {
      primary: '#9b87f5',
      secondary: '#1A1F2C',
      accent: '#D6BCFA',
    },
    soft: {
      primary: '#F2FCE2',
      secondary: '#1A1F2C',
      accent: '#FEC6A1',
    },
    wave: {
      primary: '#0EA5E9',
      secondary: '#1A1F2C',
      accent: '#33C3F0',
    },
  };

  const initAudio = async () => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      setIsListening(true);
      draw();

      toast({
        title: "Audio Connected",
        description: "Now listening to audio input",
      });
    } catch (error) {
      console.error('Error accessing audio:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access audio. Please check your permissions.",
      });
    }
  };

  const stopListening = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsListening(false);
    toast({
      title: "Audio Stopped",
      description: "Stopped listening to audio input",
    });
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

      switch (currentVisualizer) {
        case 'bars':
          BarsVisualizer({ ctx, canvas, dataArray, bufferLength, theme, themeColors });
          break;
        case 'wave':
          WaveVisualizer({ ctx, canvas, dataArray, bufferLength, theme, themeColors });
          break;
        case 'circle':
          CircleVisualizer({ ctx, canvas, dataArray, theme, themeColors });
          break;
      }
    };

    drawFrame();
  };

  useEffect(() => {
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
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {!isListening ? (
          <button
            onClick={initAudio}
            className="px-4 py-2 bg-meter-accent1 text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Listen to Audio
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-4 py-2 bg-meter-accent2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <VolumeX className="w-4 h-4" />
            Stop Listening
          </button>
        )}
        <select
          value={currentVisualizer}
          onChange={(e) => setCurrentVisualizer(e.target.value as 'bars' | 'wave' | 'circle')}
          className="px-4 py-2 bg-[#1A1F2C] border border-meter-accent1 text-white rounded-lg"
        >
          <option value="bars">Bars</option>
          <option value="wave">Wave</option>
          <option value="circle">Circle</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-64 rounded-lg bg-[#1A1F2C] transition-all duration-300",
          className
        )}
        width={1024}
        height={256}
      />
    </div>
  );
};