import { loadIndex, loadTrack } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Music2, Activity, BarChart3 } from 'lucide-react';
import { TrackCard } from '@/components/track-card';
import type { Track } from '@/lib/types';

export default async function Home() {
  const { tracks } = await loadIndex();
  
  // Load full track data for each track
  const fullTracks: Track[] = [];
  for (const trackSummary of tracks) {
    const fullTrack = await loadTrack(trackSummary.date);
    if (fullTrack) {
      fullTracks.push(fullTrack);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-800/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Coincerto</h1>
              <p className="text-sm text-muted-foreground">
                AI music from market sentiment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                {fullTracks.length} {fullTracks.length === 1 ? 'Track' : 'Tracks'}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Activity className="h-3.5 w-3.5" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {fullTracks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Music2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">No tracks yet</CardTitle>
                <CardDescription className="text-base">
                  The first AI-generated track will appear here once the market sentiment analysis is complete.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Latest Compositions</h2>
              <p className="text-muted-foreground">
                Algorithmic music generation based on real-time cryptocurrency market data
              </p>
            </div>
            <Separator />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fullTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 