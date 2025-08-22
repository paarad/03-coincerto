# Coincerto 🎵

> AI-generated music based on cryptocurrency market sentiment

Coincerto automatically creates instrumental music tracks by translating crypto market indicators (fear/greed, volatility, momentum) into musical parameters (BPM, key, mood, etc.).

## ✨ Features

- **🎵 Automatic Generation** : New track every day at 7 AM UTC
- **📊 Market Data** : Uses crypto indicators to create music
- **🎨 Cover Art** : AI-generated images with date overlay
- **🎧 Modern Interface** : Elegant design with shadcn/ui
- **📱 Responsive** : Works on mobile and desktop
- **⚡ Performance** : Optimized images and fast loading

## 🚀 Quick Deploy

1. **Fork this repo** on GitHub
2. **Deploy to Vercel** with one click
3. **Configure your API keys** in environment variables
4. **Enjoy** your AI music generator!

## 🔧 Environment Variables

```env
# Music Generation (ElevenLabs)
MUSIC_API_URL=https://api.elevenlabs.io/v1/text-to-speech
MUSIC_API_KEY=your_elevenlabs_key

# Image Generation (OpenAI DALL-E 3)
IMAGE_API_URL=https://api.openai.com/v1/images/generations
IMAGE_API_KEY=your_openai_key

# Market Data (CoinGecko)
MARKET_API_URL=https://api.coingecko.com/api/v3
```

## 🎯 How It Works

1. **Market Analysis** : Fetches crypto market data daily
2. **Music Mapping** : Converts market indicators to musical parameters
3. **AI Generation** : Creates unique instrumental tracks
4. **Cover Art** : Generates matching images with overlays
5. **Web Display** : Shows everything in a beautiful interface

## 🎨 Customization

- **Music Style** : Modify prompts in `lib/prompts.ts`
- **Market Mapping** : Adjust parameters in `lib/mapping.ts`
- **UI Design** : Customize components in `components/`
- **Generation Schedule** : Change timing in GitHub Actions

## 📱 Tech Stack

- **Frontend** : Next.js 15, React, TypeScript
- **UI** : shadcn/ui, Tailwind CSS
- **Music** : ElevenLabs API
- **Images** : OpenAI DALL-E 3 + Sharp
- **Data** : CoinGecko API
- **Deployment** : Vercel
- **Automation** : GitHub Actions

## 🎵 Listen & Enjoy

Each track is unique and reflects the current market sentiment. From calm ambient during stable periods to energetic beats during volatile times - the music tells the story of the crypto market!

---
