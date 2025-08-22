import type { Indicators } from './types';

export async function fetchIndicators(): Promise<Indicators> {
  const feedUrl = process.env.NEXT_PUBLIC_FEED_URL || 'https://paarad.github.io/02-market-sentiment-feed/feed.json';
  
  try {
    console.log('📊 Fetching market indicators from Project 2...');
    
    // TEMPORARY: Force fallback to fake data while you fix Project 2
    throw new Error('Temporarily using fake data for testing');
    
    const response = await fetch(feedUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    
    if (!response.ok) {
      throw new Error(`Project 2 feed error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Project 2 data to our Indicators interface
    const indicators = transformProject2Data(data);
    
    // Validate the transformed data
    validateIndicators(indicators);
    
    console.log('✅ Successfully fetched indicators from Project 2');
    return indicators;
    
  } catch (error) {
    console.error('❌ Failed to fetch indicators from Project 2:', error);
    console.log('🔄 Falling back to fake ETH pump data');
    return getDemoIndicators();
  }
}

function transformProject2Data(feedData: any): Indicators {
  // Your Project 2 feed structure: { summary: { crypto_sentiment, global_sentiment, combined_sentiment, confidence } }
  const summary = feedData.summary || {};
  const cryptoSentiment = summary.crypto_sentiment || 0.5;
  const globalSentiment = summary.global_sentiment || 0.5;
  const combinedSentiment = summary.combined_sentiment || 0.5;
  const confidence = summary.confidence || 0.5;
  
  // Transform sentiment scores to crypto market indicators
  // Higher crypto sentiment = bullish, lower = bearish
  const change24h = (cryptoSentiment - 0.5) * 1.6; // -0.8 to +0.8 range
  const vol = Math.abs(cryptoSentiment - 0.5) * 2; // 0 to 1, higher when extreme sentiment
  const fearGreed = Math.floor(cryptoSentiment * 100); // 0-100 scale
  const momentum = (combinedSentiment - 0.5) * 2; // -1 to +1
  
  // Determine regime based on sentiment
  let regime: 'bull' | 'bear' | 'chop';
  if (cryptoSentiment > 0.6) {
    regime = 'bull';
  } else if (cryptoSentiment < 0.4) {
    regime = 'bear';
  } else {
    regime = 'chop';
  }
  
  // Activity based on confidence (higher confidence = more activity)
  const activity = confidence;
  
  // Dominance - if global sentiment is much higher than crypto, it's traditional markets (BTC)
  // If crypto sentiment is higher, it's alt season (ETH/mixed)
  let dominance: 'btc' | 'eth' | 'mixed';
  if (globalSentiment > cryptoSentiment + 0.1) {
    dominance = 'btc';
  } else if (cryptoSentiment > 0.6) {
    dominance = 'eth'; // High crypto sentiment = alt season
  } else {
    dominance = 'mixed';
  }
  
  return {
    change24h,
    vol,
    fearGreed,
    momentum,
    regime,
    activity,
    dominance
  };
}

function transformFeedData(feedData: any): Indicators {
  // Your feed structure: { summary: { crypto_sentiment, global_sentiment, combined_sentiment, confidence } }
  const summary = feedData.summary || {};
  const cryptoSentiment = summary.crypto_sentiment || 0.5;
  const globalSentiment = summary.global_sentiment || 0.5;
  const combinedSentiment = summary.combined_sentiment || 0.5;
  const confidence = summary.confidence || 0.5;
  
  // Transform sentiment scores to crypto market indicators
  // Higher crypto sentiment = bullish, lower = bearish
  const change24h = (cryptoSentiment - 0.5) * 1.6; // -0.8 to +0.8 range
  const vol = Math.abs(cryptoSentiment - 0.5) * 2; // 0 to 1, higher when extreme sentiment
  const fearGreed = Math.floor(cryptoSentiment * 100); // 0-100 scale
  const momentum = (combinedSentiment - 0.5) * 2; // -1 to +1
  
  // Determine regime based on sentiment
  let regime: 'bull' | 'bear' | 'chop';
  if (cryptoSentiment > 0.6) {
    regime = 'bull';
  } else if (cryptoSentiment < 0.4) {
    regime = 'bear';
  } else {
    regime = 'chop';
  }
  
  // Activity based on confidence (higher confidence = more activity)
  const activity = confidence;
  
  // Dominance - if global sentiment is much higher than crypto, it's traditional markets (BTC)
  // If crypto sentiment is higher, it's alt season (ETH/mixed)
  let dominance: 'btc' | 'eth' | 'mixed';
  if (globalSentiment > cryptoSentiment + 0.1) {
    dominance = 'btc';
  } else if (cryptoSentiment > 0.6) {
    dominance = 'eth'; // High crypto sentiment = alt season
  } else {
    dominance = 'mixed';
  }
  
  return {
    change24h,
    vol,
    fearGreed,
    momentum,
    regime,
    activity,
    dominance
  };
}

function validateIndicators(data: any): asserts data is Indicators {
  const required = ['change24h', 'vol', 'fearGreed', 'momentum', 'regime', 'activity', 'dominance'];
  
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate ranges
  if (data.change24h < -1 || data.change24h > 1) {
    throw new Error('change24h must be between -1 and 1');
  }
  
  if (data.vol < 0 || data.vol > 1) {
    throw new Error('vol must be between 0 and 1');
  }
  
  if (data.fearGreed < 0 || data.fearGreed > 100) {
    throw new Error('fearGreed must be between 0 and 100');
  }
  
  if (data.momentum < -1 || data.momentum > 1) {
    throw new Error('momentum must be between -1 and 1');
  }
  
  if (!['bull', 'bear', 'chop'].includes(data.regime)) {
    throw new Error('regime must be bull, bear, or chop');
  }
  
  if (data.activity < 0 || data.activity > 1) {
    throw new Error('activity must be between 0 and 1');
  }
  
  if (!['btc', 'eth', 'mixed'].includes(data.dominance)) {
    throw new Error('dominance must be btc, eth, or mixed');
  }
}

function getDemoIndicators(): Indicators {
  // Fake bullish data reflecting ETH pump! 🚀
  console.log('🎭 Using fake bull market data (ETH pump mode)');
  
  return {
    change24h: 0.085, // 8.5% pump
    vol: 0.72, // High volatility from the pump
    fearGreed: 78, // Greed mode activated
    momentum: 0.8, // Strong upward momentum  
    regime: 'bull', // Bull market confirmed
    activity: 0.9, // High on-chain activity
    dominance: 'eth' // ETH season! 🦄
  };
} 