import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Volume2, VolumeX, Mic } from 'lucide-react';
import { SpectrogramVisualizer } from './visualizers/SpectrogramVisualizer';
import { WaveformVisualizer } from './visualizers/WaveformVisualizer';
import { SpectrumVisualizer } from './visualizers/SpectrumVisualizer';
import { StereometerVisualizer } from './visualizers/StereometerVisualizer';
import { PeakLUFSVisualizer } from './visualizers/PeakLUFSVisualizer';
import { OscilloscopeVisualizer } from './visualizers/OscilloscopeVisualizer';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type VisualizerType = 'spectrogram' | 'waveform' | 'spectrum' | 'stereometer' | 'peaklufs' | 'oscilloscope';
type AudioSource = 'microphone' | 'system';

interface AudioMeterProps {
  theme?: 'default' | 'neon' | 'vintage' | 'purple' | 'soft' | 'wave';
  visualizer?: VisualizerType;
  className?: string;
}

export const AudioMeter = ({ theme = 'default', visualizer = 'spectrum', className }: AudioMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioSource>('system');
  const [currentVisualizer, setCurrentVisualizer] = useState<VisualizerType>(visualizer);

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

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      let stream;
      if (audioSource === 'system') {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            mandatory: {
              chromeMediaSource: 'desktop'
            }
          } as any
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
      }
      
      mediaStreamRef.current = stream;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      setIsListening(true);
      draw();

      toast({
        title: `${audioSource === 'system' ? 'System' : 'Microphone'} Audio Connected`,
        description: `Now listening to ${audioSource === 'system' ? 'system' : 'microphone'} audio`,
      });
    } catch (error) {
      console.error('Error accessing audio:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not access ${audioSource} audio. Please check your permissions.`,
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
        <ToggleGroup type="single" value={audioSource} onValueChange={(value) => value && setAudioSource(value as AudioSource)}>
          <ToggleGroupItem value="system" aria-label="System Audio">
            <Volume2 className="w-4 h-4 mr-2" />
            System
          </ToggleGroupItem>
          <ToggleGroupItem value="microphone" aria-label="Microphone">
            <Mic className="w-4 h-4 mr-2" />
            Microphone
          </ToggleGroupItem>
        </ToggleGroup>

        {!isListening ? (
          <Button
            onClick={initAudio}
            className="bg-meter-accent1 text-black hover:bg-meter-accent1/90"
          >
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
          "w-full h-64 rounded-lg bg-[#1A1F2C] transition-all duration-300",
          className
        )}
        width={1024}
        height={256}
      />
    </div>
  );
};
