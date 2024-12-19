import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface AudioMeterProps {
  theme?: 'default' | 'neon' | 'vintage' | 'purple' | 'soft';
  className?: string;
}

export const AudioMeter = ({ theme = 'default', className }: AudioMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

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
  };

  const initAudio = async (type: 'microphone' | 'playback') => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = type === 'microphone' 
        ? { audio: true }
        : { audio: { mediaSource: 'audiooutput' } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints);
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
        description: `Now listening to ${type === 'microphone' ? 'microphone' : 'system audio'}`,
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
      {!isListening && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => initAudio('microphone')}
            className="px-4 py-2 bg-meter-accent1 text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Listen to Microphone
          </button>
          <button
            onClick={() => initAudio('playback')}
            className="px-4 py-2 bg-meter-accent2 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Listen to System Audio
          </button>
        </div>
      )}
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