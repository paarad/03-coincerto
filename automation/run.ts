#!/usr/bin/env tsx

import 'dotenv/config';
import { fetchIndicators } from '../lib/project2-client';
import { generateMusic } from '../lib/music-client';
import { generateImage } from '../lib/image-client';
import { createZoraMint } from '../lib/zora';
import { saveTrack } from '../lib/storage';
import { toMusicParams } from '../lib/mapping';
import { generateMusicPrompt, generateImagePrompt } from '../lib/prompts';
import { applyOverlay } from '../lib/overlay';
import type { Track } from '../lib/types';
import fs from 'node:fs/promises';
import path from 'node:path';

async function generateDailySeed(): Promise<number> {
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD
  
  // Create deterministic seed from date
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

export async function runPipeline(isDryRun: boolean = false): Promise<Track> {
  const today = new Date().toISOString().slice(0, 10);
  const seed = await generateDailySeed();
  
  console.log(`\n🚀 Starting Coincerto pipeline for ${today}`);
  console.log(`📅 Date: ${today}`);
  console.log(`🎲 Seed: ${seed}`);
  console.log(`🧪 Dry run: ${isDryRun ? 'Yes' : 'No'}\n`);
  
  try {
    // Step 1: Fetch market indicators
    console.log('📊 Fetching market indicators...');
    const indicators = await fetchIndicators();
    console.log('Indicators:', indicators);
    
    // Step 2: Map to music parameters
    console.log('\n🎵 Mapping indicators to music parameters...');
    const musicParams = toMusicParams(indicators);
    console.log('Music params:', musicParams);
    
    // Step 3: Generate prompts
    console.log('\n📝 Generating prompts...');
    const musicPrompt = generateMusicPrompt(musicParams);
    const imagePrompt = generateImagePrompt(indicators, musicParams);
    
    console.log('Music prompt:', musicPrompt);
    console.log('Image prompt:', imagePrompt);
    
    // Create base track object
    const track: Track = {
      id: `coincerto-${today}`,
      date: today,
      title: `Coincerto — ${today}`,
      indicators,
      musicParams,
      prompts: {
        music: musicPrompt,
        image: imagePrompt
      },
      seed
    };
    
    if (isDryRun) {
      console.log('\n🧪 Dry run mode - skipping API calls');
      // Add placeholder URLs for dry run
      track.audioUrl = `https://placeholder-audio-${seed}.wav`;
      track.imageUrl = `https://placeholder-image-${seed}.jpg`;
    } else {
      // Step 4: Generate music (parallel with image generation)
      console.log('\n🎵 Generating music and image...');
      
      const [audioUrl, imageUrl] = await Promise.all([
        generateMusic(musicPrompt, seed),
        generateImage(imagePrompt, seed)
      ]);
      
      track.audioUrl = audioUrl || undefined;
      
      // Apply overlay to the generated image
      if (imageUrl) {
        console.log('🖼️  Applying overlay to image...');
        try {
          const overlayBuffer = await applyOverlay({
            baseImage: imageUrl,
            title: "Coincerto",
            date: today,
            fearGreed: indicators.fearGreed,
            outFormat: "png",
          });
          
          // Save the overlay image locally
          const mediaDir = path.join(process.cwd(), "data", "tracks", "media");
          await fs.mkdir(mediaDir, { recursive: true });
          const fileName = `${track.id}-overlay.png`;
          const overlayPath = path.join(mediaDir, fileName);
          await fs.writeFile(overlayPath, overlayBuffer);
          
          // Use the local overlay image URL
          track.imageUrl = `/api/media/${fileName}`;
          console.log('✅ Overlay applied and saved:', overlayPath);
        } catch (error) {
          console.error('❌ Failed to apply overlay:', error);
          track.imageUrl = imageUrl; // Fallback to original image
        }
      } else {
        track.imageUrl = undefined;
      }
      
      // Step 5: Create Zora mint (if configured and assets available)
      if (track.audioUrl && track.imageUrl) {
        console.log('\n🏛️  Creating Zora mint...');
        const { mintUrl, tokenId } = await createZoraMint(track);
        track.mintUrl = mintUrl;
        track.tokenId = tokenId;
      } else {
        console.log('\n⚠️  Skipping Zora mint - missing audio or image URLs');
      }
    }
    
    // Step 6: Save track data
    console.log('\n💾 Saving track data...');
    await saveTrack(track);
    
    console.log('\n✅ Pipeline completed successfully!');
    console.log(`Track saved: ${track.id}`);
    
    return track;
    
  } catch (error) {
    console.error('\n❌ Pipeline failed:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const isDryRun = process.argv.includes('--dry');
  
  runPipeline(isDryRun)
    .then((track) => {
      console.log('\n🎉 Success! Track generated:', track.id);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Failed:', error);
      process.exit(1);
    });
} 