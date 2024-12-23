import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { VolumeX, Mic } from 'lucide-react';
import { SpectrogramVisualizer } from './visualizers/SpectrogramVisualizer';
import { WaveformVisualizer } from './visualizers/WaveformVisualizer';
import { SpectrumVisualizer } from './visualizers/SpectrumVisualizer';
import { StereometerVisualizer } from './visualizers/StereometerVisualizer';
import { PeakLUFSVisualizer } from './visualizers/PeakLUFSVisualizer';
import { OscilloscopeVisualizer } from './visualizers/OscilloscopeVisualizer';
import { Button } from "@/components/ui/button";

type VisualizerType = 'spectrogram' | 'waveform' | 'spectrum' | 'stereometer' | 'peaklufs' | 'oscilloscope';
type ThemeType = 'magenta' | 'ocean' | 'sunset' | 'pink';

interface AudioMeterProps {
  theme: ThemeType;
  visualizer?: VisualizerType;
  className?: string;
  onThemeChange?: (theme: ThemeType) => void;
}

export const AudioMeter = ({ theme = 'pink', visualizer = 'spectrum', className, onThemeChange }: AudioMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [currentVisualizer, setCurrentVisualizer] = useState<VisualizerType>(visualizer);

  const themeColors = {
    magenta: {
      primary: '#D946EF',
      secondary: '#8B5CF6'
    },
    ocean: {
      primary: '#0EA5E9',
      secondary: '#2563EB'
    },
    sunset: {
      primary: '#F97316',
      secondary: '#DB2777'
    },
    pink: {
      primary: '#FF69B4',
      secondary: '#9333EA'
    }
  };

  const [visualizerSettings, setVisualizerSettings] = useState({
    orientation: 'horizontal' as const,
    mode: 'sharp' as const,
    curve: 'linear' as const,
    brightnessBoost: 1.0,
    channels: ['mid'] as ('left' | 'right' | 'mid' | 'side')[],
    colorMode: 'static' as const,
    showPeakHistory: true,
    speed: 1,
    showFrequency: true,
    followPitch: true,
    cycle: 'multi' as const
  });

  const initAudio = async () => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      mediaStreamRef.current = stream;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      setIsListening(true);
      draw();

      toast({
        title: "Microphone Connected",
        description: "Now listening to microphone audio",
      });
    } catch (error) {
      console.error('Error accessing audio:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone audio. Please check your permissions.",
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
        case 'spectrogram':
          SpectrogramVisualizer({ 
            ctx, 
            canvas, 
            dataArray, 
            theme, 
            themeColors,
            orientation: visualizerSettings.orientation,
            mode: visualizerSettings.mode,
            curve: visualizerSettings.curve,
            brightnessBoost: visualizerSettings.brightnessBoost
          });
          break;
        case 'waveform':
          WaveformVisualizer({ 
            ctx, 
            canvas, 
            dataArray, 
            theme, 
            themeColors,
            channels: visualizerSettings.channels,
            colorMode: visualizerSettings.colorMode,
            showPeakHistory: visualizerSettings.showPeakHistory,
            speed: visualizerSettings.speed
          });
          break;
        case 'spectrum':
          SpectrumVisualizer({ 
            ctx, 
            canvas, 
            dataArray, 
            theme, 
            themeColors,
            mode: 'fft',
            showFrequency: visualizerSettings.showFrequency
          });
          break;
        case 'stereometer':
          StereometerVisualizer({
            ctx,
            canvas,
            dataArray,
            theme,
            themeColors,
            mode: 'logarithmic',
            colorMode: 'static'
          });
          break;
        case 'peaklufs':
          PeakLUFSVisualizer({
            ctx,
            canvas,
            dataArray,
            theme,
            themeColors
          });
          break;
        case 'oscilloscope':
          OscilloscopeVisualizer({
            ctx,
            canvas,
            dataArray,
            theme,
            themeColors,
            followPitch: visualizerSettings.followPitch,
            cycle: visualizerSettings.cycle
          });
          break;
      }
    };

    drawFrame();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center items-center flex-wrap">
        {!isListening ? (
          <Button
            onClick={initAudio}
            className="bg-meter-accent1 text-black hover:bg-meter-accent1/90"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Listening
          </Button>
        ) : (
          <Button
            onClick={stopListening}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <VolumeX className="w-4 h-4" />
            Stop Listening
          </Button>
        )}
        <select
          value={currentVisualizer}
          onChange={(e) => setCurrentVisualizer(e.target.value as VisualizerType)}
          className="px-4 py-2 bg-[#1A1F2C] border border-meter-accent1 text-white rounded-lg"
        >
          <option value="spectrum">Spectrum</option>
          <option value="waveform">Waveform</option>
          <option value="spectrogram">Spectrogram</option>
          <option value="stereometer">Stereometer</option>
          <option value="peaklufs">Peak/LUFS</option>
          <option value="oscilloscope">Oscilloscope</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-64 rounded-lg transition-all duration-300",
          className
        )}
        width={1024}
        height={256}
      />
    </div>
  );
};
