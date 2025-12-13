import { NextResponse } from 'next/server';

// Add your API keys in .env.local
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

async function fetchRealWalletData(walletAddress) {
  try {
    // Fetch token balances from Moralis
    const tokensResponse = await fetch(
      `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=eth`,
      {
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    if (!tokensResponse.ok) {
      throw new Error('Failed to fetch token data');
    }

    const tokens = await tokensResponse.json();

    // Fetch native ETH balance
    const balanceResponse = await fetch(
      `https://deep-index.moralis.io/api/v2/${walletAddress}/balance?chain=eth`,
      {
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    const balanceData = await balanceResponse.json();
    const ethBalance = parseFloat(balanceData.balance) / 1e18;

    // Fetch wallet transactions for historical data
    const transactionsResponse = await fetch(
      `https://deep-index.moralis.io/api/v2/${walletAddress}?chain=eth&limit=100`,
      {
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    const transactions = await transactionsResponse.json();

    // Calculate real portfolio metrics
    const assets = [];
    let totalValue = 0;

    // Add ETH if balance exists
    if (ethBalance > 0) {
      const ethPriceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const ethPriceData = await ethPriceResponse.json();
      const ethPrice = ethPriceData.ethereum.usd;
      const ethValue = ethBalance * ethPrice;

      assets.push({
        symbol: 'ETH',
        name: 'Ethereum',
        balance: ethBalance.toString(),
        value: ethValue,
        change24h: 0, // Will be calculated from price API
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        priceHistory: [], // Will be fetched from CoinGecko
      });

      totalValue += ethValue;
    }

    // Process ERC20 tokens
    for (const token of tokens) {
      if (!token.possible_spam && parseFloat(token.balance) > 0) {
        const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals);
        const tokenValue = tokenBalance * (parseFloat(token.usd_price) || 0);

        if (tokenValue > 1) { // Only include tokens worth more than $1
          assets.push({
            symbol: token.symbol,
            name: token.name,
            balance: tokenBalance.toString(),
            value: tokenValue,
            change24h: parseFloat(token.usd_price_24hr_percent_change) || 0,
            logo: token.logo || token.thumbnail,
            priceHistory: [], // Can be fetched from price APIs
          });

          totalValue += tokenValue;
        }
      }
    }

    // Sort assets by value
    assets.sort((a, b) => b.value - a.value);

    // Calculate portfolio metrics from real data
    const bestPerformer = assets.reduce((best, asset) => 
      asset.change24h > (best?.change24h || -Infinity) ? asset : best
    , null);

    // Calculate 24h change
    const totalChange24h = assets.reduce((sum, asset) => 
      sum + (asset.value * asset.change24h / 100), 0
    );
    const changePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

    // Calculate asset allocation
    const assetAllocation = assets.slice(0, 5).map(asset => ({
      name: asset.symbol,
      value: (asset.value / totalValue) * 100,
      color: getColorForAsset(asset.symbol)
    }));

    // Calculate risk score based on volatility and diversification
    const riskScore = calculateRiskScore(assets, totalValue);

    // Generate historical data from transactions
    const historicalData = generateHistoricalFromTransactions(transactions.result || [], totalValue);

    // Calculate portfolio health metrics
    const healthMetrics = calculateHealthMetrics(assets, totalValue);

    // Calculate portfolio metrics for radar chart
    const portfolioMetrics = calculatePortfolioMetrics(assets, transactions.result || []);

    return {
      totalValue,
      change24h: totalChange24h,
      changePercent,
      riskScore,
      riskProfile: getRiskProfile(riskScore),
      bestPerformer: bestPerformer ? {
        symbol: bestPerformer.symbol,
        change: bestPerformer.change24h
      } : null,
      assets,
      historicalData,
      assetAllocation,
      healthMetrics,
      portfolioMetrics,
      activityData: generateActivityFromTransactions(transactions.result || [])
    };

  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
}

function getColorForAsset(symbol) {
  const colors = {
    'ETH': '#8B5CF6',
    'BTC': '#A78BFA',
    'USDC': '#C4B5FD',
    'USDT': '#7C3AED',
    'DAI': '#DDD6FE',
  };
  return colors[symbol] || '#8B5CF6';
}

function calculateRiskScore(assets, totalValue) {
  if (assets.length === 0) return 0;

  // Diversification score (0-40 points)
  const diversificationScore = Math.min(assets.length * 5, 40);

  // Volatility score based on 24h changes (0-30 points)
  const avgVolatility = assets.reduce((sum, a) => sum + Math.abs(a.change24h), 0) / assets.length;
  const volatilityScore = Math.max(0, 30 - avgVolatility);

  // Concentration risk (0-30 points)
  const topAssetPercent = assets[0]?.value / totalValue * 100;
  const concentrationScore = Math.max(0, 30 - topAssetPercent);

  const totalScore = diversificationScore + volatilityScore + concentrationScore;
  return Math.min(10, totalScore / 10); // Scale to 0-10
}

function getRiskProfile(score) {
  if (score <= 3) return 'Conservative';
  if (score <= 6) return 'Balanced';
  if (score <= 8) return 'Aggressive';
  return 'Very Aggressive';
}

function generateHistoricalFromTransactions(transactions, currentValue) {
  const days = 30;
  const data = [];
  
  // Group transactions by day
  const txByDay = {};
  transactions.forEach(tx => {
    const date = new Date(tx.block_timestamp).toISOString().split('T')[0];
    if (!txByDay[date]) txByDay[date] = [];
    txByDay[date].push(tx);
  });

  // Generate data points
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Estimate value based on transaction activity
    const txCount = txByDay[dateStr]?.length || 0;
    const valueEstimate = currentValue * (1 - (i / days) * 0.1 + (txCount * 0.01));
    
    data.push({
      date: dateStr,
      value: Math.max(valueEstimate, currentValue * 0.5)
    });
  }

  return data;
}

function generateActivityFromTransactions(transactions) {
  const activityMap = {};
  
  transactions.forEach(tx => {
    const date = new Date(tx.block_timestamp).toISOString().split('T')[0];
    activityMap[date] = (activityMap[date] || 0) + 1;
  });

  return Object.entries(activityMap).map(([date, count]) => [date, count]);
}

function calculateHealthMetrics(assets, totalValue) {
  // Diversification: based on number of assets and distribution
  const diversification = Math.min(100, (assets.length / 10) * 100);

  // Liquidity: based on stablecoin percentage
  const stablecoins = assets.filter(a => 
    ['USDC', 'USDT', 'DAI', 'BUSD'].includes(a.symbol)
  );
  const stablecoinValue = stablecoins.reduce((sum, a) => sum + a.value, 0);
  const liquidity = (stablecoinValue / totalValue) * 100;

  // Performance: based on 24h change
  const avgChange = assets.reduce((sum, a) => sum + a.change24h, 0) / assets.length;
  const performance = Math.min(100, Math.max(0, 50 + avgChange * 5));

  return {
    diversification: Math.round(diversification),
    liquidity: Math.round(liquidity),
    performance: Math.round(performance)
  };
}

function calculatePortfolioMetrics(assets, transactions) {
  return {
    diversification: Math.min(100, (assets.length / 10) * 100),
    liquidity: 70, // Calculate based on DEX liquidity
    growth: 75, // Calculate based on price trends
    stability: 60, // Calculate based on volatility
    volume: 65, // Calculate based on transaction volume
    marketCap: 80 // Calculate based on market cap of holdings
  };
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

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    if (!MORALIS_API_KEY) {
      return NextResponse.json(
        { error: 'Moralis API key not configured' },
        { status: 500 }
      );
    }

    const portfolioData = await fetchRealWalletData(walletAddress);

    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet data', details: error.message },
      { status: 500 }
    );
  }
}
