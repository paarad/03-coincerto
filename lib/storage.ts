import { promises as fs } from 'fs';
import { join } from 'path';
import type { Track, TrackIndex } from './types';

const DATA_DIR = join(process.cwd(), 'data', 'tracks');
const INDEX_FILE = join(DATA_DIR, 'index.json');

export async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

export async function saveTrack(track: Track): Promise<void> {
  await ensureDataDirectory();
  
  const trackFile = join(DATA_DIR, `${track.date}.json`);
  
  try {
    await fs.writeFile(trackFile, JSON.stringify(track, null, 2), 'utf-8');
    console.log(`💾 Saved track to ${trackFile}`);
    
    // Update index
    await updateIndex(track);
  } catch (error) {
    console.error('Failed to save track:', error);
    throw error;
  }
}

export async function loadTrack(date: string): Promise<Track | null> {
  const trackFile = join(DATA_DIR, `${date}.json`);
  
  try {
    const content = await fs.readFile(trackFile, 'utf-8');
    return JSON.parse(content) as Track;
  } catch (error) {
    return null;
  }
}

export async function loadIndex(): Promise<TrackIndex> {
  try {
    const content = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(content) as TrackIndex;
  } catch (error) {
    return { tracks: [] };
  }
}

async function updateIndex(track: Track): Promise<void> {
  try {
    const index = await loadIndex();
    
    // Remove existing entry for this date
    const filteredTracks = index.tracks.filter(t => t.date !== track.date);
    
    // Add new entry
    const trackEntry = {
      id: track.id,
      date: track.date,
      title: track.title,
      audioUrl: track.audioUrl,
      imageUrl: track.imageUrl,
      mintUrl: track.mintUrl
    };
    
    filteredTracks.push(trackEntry);
    
    // Sort by date descending (newest first)
    filteredTracks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const updatedIndex: TrackIndex = { tracks: filteredTracks };
    
    await fs.writeFile(INDEX_FILE, JSON.stringify(updatedIndex, null, 2), 'utf-8');
    console.log(`📋 Updated index with ${filteredTracks.length} tracks`);
  } catch (error) {
    console.error('Failed to update index:', error);
  }
} 