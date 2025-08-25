import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔔 Cron job triggered - GitHub Actions will handle track generation');
    
    return NextResponse.json({
      ok: true,
      message: 'Cron job triggered - Track generation handled by GitHub Actions',
      note: 'Check GitHub Actions for actual track generation status',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Cron job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
} 