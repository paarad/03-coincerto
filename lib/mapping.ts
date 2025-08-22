import type { Indicators, MusicParams } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function toMusicParams(indicators: Indicators, spice: number = 0.6): MusicParams {
  const { change24h, vol, fearGreed, momentum, regime, activity, dominance } = indicators;
  
  // BPM calculation
  const bpm = clamp(120 + change24h * 25 + vol * 15, 90, 160);
  
  // Mode based on regime
  let mode: string;
  switch (regime) {
    case 'bear':
      mode = 'minor';
      break;
    case 'bull':
      mode = 'major';
      break;
    case 'chop':
      mode = 'dorian';
      break;
    default:
      mode = 'aeolian';
  }
  
  // Brightness calculation - reduced intensity to avoid overly bright/shrill music
  const brightness = clamp(
    fearGreed / 20 + momentum * 1.5 + (regime === 'bull' ? 0.5 : 0) + 2,
    2,
    7
  );
  
  // Density calculation
  const density = clamp(3 + vol * 5 + activity * 2, 1, 10);
  
  // Rhythm complexity
  const rhythmComplexity = clamp(
    2 + vol * 6 + (regime === 'chop' ? 1 : 0),
    1,
    10
  );
  
  // Harmony movement
  const harmonyMovement = clamp(2 + (momentum + 1) * 3, 1, 10);
  
  // Key mapping from fearGreed
  const keyIndex = Math.floor((fearGreed / 100) * KEYS.length);
  const key = KEYS[Math.min(keyIndex, KEYS.length - 1)];
  
  // Instrument hints based on dominance
  let instrumentHints: string;
  switch (dominance) {
    case 'btc':
      instrumentHints = 'mono lead synthesizer, focused bass, tight arrangement';
      break;
    case 'eth':
      instrumentHints = 'polyphonic pads, atmospheric textures, layered harmonies';
      break;
    case 'mixed':
      instrumentHints = 'balanced ensemble, varied textures, dynamic interplay';
      break;
  }
  
  // Mood words
  const moodWords: string[] = [];
  
  // Base mood from regime
  switch (regime) {
    case 'bull':
      moodWords.push('optimistic');
      break;
    case 'bear':
      moodWords.push('brooding');
      break;
    case 'chop':
      moodWords.push('neutral');
      break;
  }
  
  // Energy from volatility
  if (vol > 0.6) {
    moodWords.push('energetic');
  } else {
    moodWords.push('calm');
  }
  
  // Direction from momentum
  if (momentum > 0) {
    moodWords.push('ascending');
  } else {
    moodWords.push('weighty');
  }
  
  return {
    bpm: Math.round(bpm),
    mode,
    brightness: Math.round(brightness * 10) / 10,
    density: Math.round(density * 10) / 10,
    rhythmComplexity: Math.round(rhythmComplexity * 10) / 10,
    harmonyMovement: Math.round(harmonyMovement * 10) / 10,
    key,
    instrumentHints,
    moodWords
  };
} 