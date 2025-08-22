export interface Indicators {
  change24h: number;   // -1..+1 normalized
  vol: number;         // 0..1 (volatility)
  fearGreed: number;   // 0..100
  momentum: number;    // -1..+1
  regime: 'bull' | 'bear' | 'chop';
  activity: number;    // 0..1 (on-chain proxy)
  dominance: 'btc' | 'eth' | 'mixed';
}

export interface MusicParams {
  bpm: number;
  mode: string;
  brightness: number;
  density: number;
  rhythmComplexity: number;
  harmonyMovement: number;
  key: string;
  instrumentHints: string;
  moodWords: string[];
}

export interface Track {
  id: string;
  date: string;
  title: string;
  audioUrl?: string;
  imageUrl?: string;
  mintUrl?: string;
  tokenId?: string;
  indicators: Indicators;
  musicParams: MusicParams;
  prompts: {
    music: string;
    image: string;
  };
  seed: number;
}

export interface TrackIndex {
  tracks: Pick<Track, 'id' | 'date' | 'title' | 'audioUrl' | 'imageUrl' | 'mintUrl'>[];
}

export interface MusicApiResponse {
  audioUrl: string;
}

export interface ImageApiResponse {
  created: number;
  data: Array<{
    url: string;
  }>;
}

export interface ZoraApiResponse {
  mintUrl?: string;
  tokenId?: string;
} 