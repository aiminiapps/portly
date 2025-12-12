import { NextResponse } from 'next/server';

// Mock function - Replace with actual Moralis/Alchemy integration
async function fetchWalletData(walletAddress) {
  // TODO: Integrate with Moralis or Alchemy API
  // Example: const response = await fetch(`https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=eth`, {
  //   headers: { 'X-API-Key': process.env.MORALIS_API_KEY }
  // });

  // For now, return structured mock data
  // In production, this would fetch real blockchain data
  
  return {
    totalValue: 15234.67,
    change24h: 456.23,
    changePercent: 3.08,
    riskScore: 6.5,
    riskProfile: 'Balanced',
    bestPerformer: { symbol: 'ETH', change: 5.2 },
    assets: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '3.2456',
        value: 7890.45,
        change24h: 5.2,
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        priceHistory: generateMockPriceHistory(2400, 0.05)
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: '0.1234',
        value: 5234.12,
        change24h: -2.1,
        logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        priceHistory: generateMockPriceHistory(42000, -0.02)
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '2000',
        value: 2000.00,
        change24h: 0.01,
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        priceHistory: generateMockPriceHistory(1, 0)
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        balance: '150.45',
        value: 110.10,
        change24h: 8.5,
        logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
        priceHistory: generateMockPriceHistory(0.73, 0.085)
      }
    ],
    historicalData: generateHistoricalData(30),
    assetAllocation: [
      { name: 'Ethereum', value: 51.8, color: '#8B5CF6' },
      { name: 'Bitcoin', value: 34.4, color: '#A78BFA' },
      { name: 'Stablecoins', value: 13.1, color: '#C4B5FD' },
      { name: 'Others', value: 0.7, color: '#7C3AED' }
    ],
    completedTasks: []
  };
}

function generateMockPriceHistory(basePrice, trendPercent) {
  const points = 30;
  const history = [];
  
  for (let i = 0; i < points; i++) {
    const trend = basePrice * (trendPercent * (i / points));
    const noise = basePrice * (Math.random() - 0.5) * 0.05;
    history.push(basePrice + trend + noise);
  }
  
  return history;
}

function generateHistoricalData(days) {
  const data = [];
  let value = 12000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    value += (Math.random() - 0.4) * 500;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(value, 8000)
    });
  }
  
  return data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const portfolioData = await fetchWalletData(walletAddress);

    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}
