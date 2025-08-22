# Coincerto

> AI-generated music tracks based on cryptocurrency market sentiment

Coincerto is a Next.js 15 application that automatically generates daily instrumental music tracks by translating cryptocurrency market indicators into musical parameters. Each track is accompanied by AI-generated cover art and can optionally be minted as NFTs on Zora.

## Features

- **Daily Automation**: Cron job generates new tracks every day at 7:00 UTC
- **Market-Driven Composition**: Converts crypto market data into musical parameters (BPM, key, mood, etc.)
- **AI-Generated Assets**: Uses external APIs for music and image generation
- **Zora Integration**: Optional NFT minting with rich metadata
- **Read-Only Gallery**: Public interface for listening and viewing tracks
- **SSR Performance**: Server-side rendered for optimal loading

## Architecture

- **Framework**: Next.js 15 with App Router, React 19, TypeScript (strict mode)
- **Data Storage**: Local JSON files (no database required)
- **Automation**: Vercel Cron → API endpoint → generation pipeline
- **Providers**: Agnostic music/image generation via URL endpoints
- **SEO**: `noindex` by default for experimental content

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp env.example .env.local
```

Configure your API keys in `.env.local`:

```env
# Required for market data (fallback to demo data if missing)
PROJECT2_API_URL=https://your-project2-api.vercel.app/api/indicators
PROJECT2_API_KEY=your-project2-api-key

# Music generation (optional - skips if missing)
MUSIC_API_URL=https://api.suno.ai/v1/generate
MUSIC_API_KEY=your-music-api-key

# Image generation (optional - skips if missing)
IMAGE_API_URL=https://api.openai.com/v1/images/generations
IMAGE_API_KEY=your-image-api-key

# Zora NFT minting (optional - skips if missing)
ZORA_CREATE_WEBHOOK_URL=https://zora.co/api/webhook/create
ZORA_API_KEY=your-zora-api-key
ZORA_CHAIN=base
ZORA_CREATOR_ADDRESS=0x1234567890123456789012345678901234567890

# Application URL (required for Vercel deployment)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 3. Development

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the gallery.

## Usage

### Manual Generation

Generate today's track manually:

```bash
# Real generation (calls external APIs)
pnpm compose:today

# Dry run (creates placeholder data)
pnpm compose:dry
```

### API Endpoints

- `GET /api/cron` - Triggers daily generation pipeline
- `POST /api/cron` - Same as GET (for manual triggers)

### Data Structure

Tracks are stored in `data/tracks/`:
- `index.json` - Track listing for the gallery
- `YYYY-MM-DD.json` - Individual track data

## Market → Music Mapping

The application converts market indicators to musical parameters:

| Market Indicator | Musical Parameter | Mapping Rule |
|------------------|------------------|--------------|
| Price Change 24h | BPM | `120 + change24h*25 + vol*15` (90-160) |
| Market Regime | Mode | bull→major, bear→minor, chop→dorian |
| Fear & Greed | Brightness | `fearGreed/10 + momentum*2 + bull_bonus` |
| Volatility | Density | `3 + vol*5 + activity*2` |
| Volatility | Rhythm Complexity | `2 + vol*6 + chop_bonus` |
| Momentum | Harmony Movement | `2 + (momentum+1)*3` |
| Fear & Greed | Key | Mapped to chromatic scale C-B |
| Dominance | Instrumentation | btc→mono, eth→poly, mixed→balanced |

## API Contracts

### Music Provider
```
POST ${MUSIC_API_URL}
Body: { "prompt": string, "seed": number, "durationSec": number }
Response: { "audioUrl": string }
```

### Image Provider
```
POST ${IMAGE_API_URL}
Body: { "prompt": string, "seed": number, "size": "1024x1024" }
Response: { "imageUrl": string }
```

### Zora Provider
```
POST ${ZORA_CREATE_WEBHOOK_URL}
Body: { title, date, audioUrl, imageUrl, indicators, params }
Response: { "mintUrl"?: string, "tokenId"?: string }
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy - the cron job will be automatically configured

### Other Platforms

For platforms other than Vercel:
1. Set up a cron job to call `GET /api/cron` daily at 07:00 UTC
2. Ensure the `data/tracks/` directory is writable
3. Configure all environment variables

## Error Handling

The application is designed to be robust:
- **Missing APIs**: Falls back to placeholder data instead of crashing
- **Network timeouts**: Each API call has reasonable timeouts
- **Storage failures**: Logs errors but continues execution
- **Invalid data**: Validates and sanitizes all inputs

## Limitations & Non-Goals

- **No Authentication**: Public read-only gallery only
- **No User-Generated Content**: Fully automated, no user inputs
- **No Database**: Uses local JSON for simplicity
- **No Editing Interface**: Tracks are generated automatically
- **Experimental Audio**: 20-second instrumental snippets only
- **No Financial Advice**: Entertainment and artistic expression only

## License

MIT License - see LICENSE file for details.

## Contributing

This is an experimental project. Issues and PRs welcome for bug fixes and improvements that align with the automated, read-only design goals. 