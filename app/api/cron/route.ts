import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔔 Daily Coincerto cron job triggered');
    
    // Note: Vercel serverless functions have read-only filesystem
    // Manual track generation is required via: npm run compose:today
    
    return NextResponse.json({
      ok: true,
      message: 'Daily Coincerto cron job triggered successfully',
      note: 'Manual track generation required due to Vercel filesystem limitations',
      instruction: 'Run npm run compose:today locally to generate today\'s track',
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