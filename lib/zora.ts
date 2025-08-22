import type { ZoraApiResponse, Track } from './types';

export async function createZoraMint(track: Track): Promise<{ mintUrl?: string; tokenId?: string }> {
  // Zora integration disabled as requested
  console.log('⚠️  Zora NFT minting disabled');
  return {};
} 