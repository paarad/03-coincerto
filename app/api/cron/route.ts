import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '../../../automation/run';

export async function GET(request: NextRequest) {
  try {
    console.log('🔔 Daily Coincerto cron job triggered');
    
    // Run the pipeline (now writing to public/ directory which should be writable)
    const track = await runPipeline(false);
    
    return NextResponse.json({
      ok: true,
      message: 'Daily Coincerto track generated successfully',
      track: {
        id: track.id,
        date: track.date,
        title: track.title,
        hasAudio: !!track.audioUrl,
        hasImage: !!track.imageUrl,
        hasMint: !!track.mintUrl
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Pipeline execution failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
} 