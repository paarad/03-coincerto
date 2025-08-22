import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import type { MusicApiResponse } from './types';

export async function generateMusic(prompt: string, seed: number): Promise<string | null> {
  const musicProvider = process.env.MUSIC_PROVIDER || 'elevenlabs';
  
  switch (musicProvider) {
    case 'elevenlabs':
      return generateWithElevenLabs(prompt, seed);
    case 'suno':
      return generateWithSuno(prompt, seed);
    case 'udio':
      return generateWithUdio(prompt, seed);
    case 'musicgen':
      return generateWithMusicGen(prompt, seed);
    default:
      console.log('⚠️  No valid music provider configured, skipping music generation');
      return null;
  }
}

async function generateWithElevenLabs(prompt: string, seed: number): Promise<string | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  ELEVENLABS_API_KEY not configured, skipping music generation');
    console.log('💡 Get your API key from: https://elevenlabs.io/app/settings/api-keys');
    return null;
  }
  
  try {
    console.log('🎵 Generating music with ElevenLabs...');
    
    // Using official ElevenLabs SDK
    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey
    });
    
    const track = await elevenlabs.music.compose({
      prompt: `${prompt}. Instrumental only, no vocals, no lyrics.`,
      musicLengthMs: 20000 // 20 seconds
    });
    
    // Convert the audio stream to a data URL for storage
    const chunks: Uint8Array[] = [];
    const reader = track.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Combine all chunks into a single Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedArray = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of chunks) {
      combinedArray.set(chunk, offset);
      offset += chunk.length;
    }
    
    // For Node.js environment, convert to base64 data URL
    const base64Audio = Buffer.from(combinedArray).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;
    
    console.log('🎵 Successfully generated music with ElevenLabs SDK');
    return audioDataUrl;
    
  } catch (error) {
    console.error('❌ Failed to generate music with ElevenLabs:', error);
    if (error instanceof Error && error.message.includes('unauthorized')) {
      console.log('🔑 Check your ELEVENLABS_API_KEY - you may need to upgrade to a paid plan');
    }
    return null;
  }
}

async function generateWithSuno(prompt: string, seed: number): Promise<string | null> {
  const apiKey = process.env.SUNO_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  SUNO_API_KEY not configured, skipping music generation');
    return null;
  }
  
  try {
    // Suno API example (adjust based on actual Suno API)
    const response = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        duration: 20,
        seed,
        instrumental: true
      }),
      signal: AbortSignal.timeout(120000), // 2 min timeout for music generation
    });
    
    if (!response.ok) {
      throw new Error(`Suno API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as MusicApiResponse;
    console.log('🎵 Successfully generated music with Suno');
    return data.audioUrl;
    
  } catch (error) {
    console.error('❌ Failed to generate music with Suno:', error);
    return null;
  }
}

async function generateWithUdio(prompt: string, seed: number): Promise<string | null> {
  const apiKey = process.env.UDIO_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  UDIO_API_KEY not configured, skipping music generation');
    return null;
  }
  
  try {
    // Udio API example (adjust based on actual Udio API)
    const response = await fetch('https://api.udio.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        length: 20,
        seed,
        instrumental: true
      }),
      signal: AbortSignal.timeout(120000),
    });
    
    if (!response.ok) {
      throw new Error(`Udio API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as MusicApiResponse;
    console.log('🎵 Successfully generated music with Udio');
    return data.audioUrl;
    
  } catch (error) {
    console.error('❌ Failed to generate music with Udio:', error);
    return null;
  }
}

async function generateWithMusicGen(prompt: string, seed: number): Promise<string | null> {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  
  if (!apiKey) {
    console.log('⚠️  REPLICATE_API_TOKEN not configured for MusicGen, skipping music generation');
    return null;
  }
  
  try {
    // Using Replicate's MusicGen model
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2dbe", // MusicGen model
        input: {
          prompt,
          duration: 20,
          seed
        }
      }),
      signal: AbortSignal.timeout(120000),
    });
    
    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status} ${response.statusText}`);
    }
    
    const prediction = await response.json();
    
    // Wait for completion (simplified - you'd want to poll in production)
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s
    
    // Get the result
    const resultResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });
    
    const result = await resultResponse.json();
    
    if (result.status === 'succeeded' && result.output) {
      console.log('🎵 Successfully generated music with MusicGen');
      return result.output;
    }
    
    throw new Error('MusicGen generation failed or timed out');
    
  } catch (error) {
    console.error('❌ Failed to generate music with MusicGen:', error);
    return null;
  }
} 