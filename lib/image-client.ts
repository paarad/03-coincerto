import type { ImageApiResponse } from './types';

export async function generateImage(prompt: string, seed: number): Promise<string | null> {
  const apiUrl = process.env.IMAGE_API_URL;
  const apiKey = process.env.IMAGE_API_KEY;
  
  if (!apiUrl || !apiKey) {
    console.log('⚠️  IMAGE_API_URL or IMAGE_API_KEY not configured, skipping image generation');
    return null;
  }
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      }),
      signal: AbortSignal.timeout(60000), // 60s timeout for generation
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // OpenAI API returns { data: [{ url: "..." }] }
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('Image API returned invalid response format');
    }
    
    const imageUrl = data.data[0].url;
    console.log('🖼️  Successfully generated cover image');
    return imageUrl;
    
  } catch (error) {
    console.error('❌ Failed to generate image:', error);
    return null;
  }
} 