import type { MusicParams, Indicators } from './types';

export function generateMusicPrompt(musicParams: MusicParams): string {
  const {
    bpm,
    mode,
    brightness,
    density,
    rhythmComplexity,
    harmonyMovement,
    key,
    instrumentHints,
    moodWords
  } = musicParams;

  const moodString = moodWords.join(', ');
  
  return `Create an instrumental track with the following characteristics:
- Key: ${key} ${mode}
- Tempo: ${bpm} BPM
- Mood: ${moodString}
- Brightness level: ${brightness}/10
- Density: ${density}/10
- Rhythm complexity: ${rhythmComplexity}/10
- Harmony movement: ${harmonyMovement}/10
- Instrumentation: ${instrumentHints}
- Style: Electronic, ambient, cinematic
- Duration: 20 seconds
- No vocals, no lyrics, instrumental only
- High quality audio production`;
}

export function generateImagePrompt(indicators: Indicators, musicParams: MusicParams): string {
  const { regime, vol, fearGreed, dominance } = indicators;
  const { moodWords } = musicParams;
  
  // Base color palette based on regime
  let colorPalette: string;
  switch (regime) {
    case 'bull':
      colorPalette = 'warm greens, golden yellows, bright blues';
      break;
    case 'bear':
      colorPalette = 'deep reds, dark purples, muted oranges';
      break;
    case 'chop':
      colorPalette = 'neutral grays, soft blues, balanced tones';
      break;
  }
  
  // Visual style based on volatility
  const visualStyle = vol > 0.6 ? 'dynamic, energetic, sharp angles' : 'smooth, flowing, organic shapes';
  
  // Complexity based on fear/greed
  const complexity = fearGreed > 70 ? 'complex, detailed, intricate patterns' : 
                    fearGreed < 30 ? 'minimal, simple, clean composition' : 
                    'balanced complexity, moderate detail';
  
  // Dominance influence
  let thematicElements: string;
  switch (dominance) {
    case 'btc':
      thematicElements = 'geometric patterns, crystalline structures, digital currency symbols';
      break;
    case 'eth':
      thematicElements = 'network nodes, interconnected web, flowing energy';
      break;
    case 'mixed':
      thematicElements = 'abstract financial charts, market dynamics, economic flow';
      break;
  }
  
  const moodString = moodWords.join(', ');
  
  return `Abstract digital art representing cryptocurrency market sentiment:
- Color palette: ${colorPalette}
- Visual style: ${visualStyle}
- Complexity: ${complexity}
- Thematic elements: ${thematicElements}
- Mood: ${moodString}
- Style: Modern digital art, abstract, financial visualization
- Composition: Square format (1:1 aspect ratio)
- No text, no letters, no numbers in the image
- High quality, artistic, suitable for album cover`;
} 