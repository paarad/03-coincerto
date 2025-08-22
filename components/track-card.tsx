'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Play, Pause, Calendar, Image as ImageIcon, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';

interface TrackCardProps {
  track: {
    id: string;
    date: string;
    title: string;
    audioUrl?: string;
    imageUrl?: string;
    mintUrl?: string;
    indicators?: {
      fearGreed: number;
      change24h: number;
      momentum: number;
      regime: string;
    };
    musicParams?: {
      bpm: number;
      key: string;
      mode: string;
      brightness: number;
      density: number;
    };
  };
}

export function TrackCard({ track }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const formattedDate = new Date(track.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handlePlay = () => {
    if (!track.audioUrl) return;

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(track.audioUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      newAudio.addEventListener('pause', () => setIsPlaying(false));
      newAudio.addEventListener('play', () => setIsPlaying(true));
      
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0.02) return <TrendingUp className="h-3 w-3" />;
    if (change < -0.02) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getFearGreedVariant = (value: number) => {
    if (value >= 75) return "default"; // Green
    if (value >= 50) return "secondary"; // Blue  
    if (value >= 25) return "outline"; // Neutral
    return "destructive"; // Red
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {track.imageUrl ? (
          <img 
            src={track.imageUrl} 
            alt={`Cover for ${track.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700">
                <ImageIcon className="h-10 w-10 text-slate-300" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        {/* Play Button Overlay */}
        {track.audioUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
            <Button 
              size="icon" 
              variant="secondary"
              className="h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              onClick={handlePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2">{track.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formattedDate}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Market Indicators */}
        {track.indicators && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fear & Greed</p>
                <Badge variant={getFearGreedVariant(track.indicators.fearGreed)} className="w-full justify-center">
                  {track.indicators.fearGreed}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">24h Change</p>
                <Badge 
                  variant={track.indicators.change24h > 0 ? "default" : "destructive"}
                  className="w-full justify-center gap-1"
                >
                  {getTrendIcon(track.indicators.change24h)}
                  {(track.indicators.change24h * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Momentum</p>
                <div className="text-sm font-medium">{track.indicators.momentum.toFixed(2)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Regime</p>
                <Badge variant={track.indicators.regime === 'bull' ? "default" : "secondary"} className="w-fit">
                  {track.indicators.regime}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Music Parameters */}
        {track.musicParams && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Musical Properties</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tempo</p>
                  <p className="font-medium">{track.musicParams.bpm} BPM</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Key</p>
                  <p className="font-medium">{track.musicParams.key} {track.musicParams.mode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Brightness</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{ width: `${(track.musicParams.brightness / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{track.musicParams.brightness}/10</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Density</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{ width: `${(track.musicParams.density / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{track.musicParams.density.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mint Link */}
        {track.mintUrl && (
          <>
            <Separator />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => window.open(track.mintUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View on Zora
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
} 