import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Volume2, VolumeX } from 'lucide-react';

interface AudioMeterProps {
  theme?: 'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave';
  visualizer?: 'bars' | 'wave';
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
    purple: {
      primary: '#9b87f5',
      secondary: '#1A1F2C',
      accent: '#D6BCFA',
    },
    soft: {
      primary: '#F2FCE2',
      secondary: '#222222',
      accent: '#FEC6A1',
    },
    wave: {
      primary: '#0EA5E9',
      secondary: '#222222',
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

  const drawBars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, bufferLength: number) => {
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

  const drawWave = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, bufferLength: number) => {
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

      if (currentVisualizer === 'bars') {
        drawBars(ctx, canvas, dataArray, bufferLength);
      } else {
        drawWave(ctx, canvas, dataArray, bufferLength);
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
          <>
            <button
              onClick={initAudio}
              className="px-4 py-2 bg-meter-accent1 text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Listen to Audio
            </button>
          </>
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
          onChange={(e) => setCurrentVisualizer(e.target.value as 'bars' | 'wave')}
          className="px-4 py-2 bg-meter-bg border border-meter-accent1 text-white rounded-lg"
        >
          <option value="bars">Bars</option>
          <option value="wave">Wave</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-64 rounded-lg bg-meter-bg transition-all duration-300",
          className
        )}
        width={1024}
        height={256}
      />
    </div>
  );
};