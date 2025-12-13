import { NextResponse } from 'next/server';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Chain Configuration
const CHAINS = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', source: 'alchemy' },
  { id: '0x89', name: 'Polygon', symbol: 'MATIC', source: 'moralis' },
  { id: '0x38', name: 'BSC', symbol: 'BNB', source: 'moralis' }
];

// 1. Fetch Ethereum Data via Alchemy (Saves Moralis Credits)
async function fetchAlchemyData(address) {
  try {
    const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    // Batch request for Balance and Token Balances
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"]
        },
        {
          jsonrpc: "2.0",
          id: 2,
          method: "alchemy_getTokenBalances",
          params: [address]
        }
      ])
    });

    const data = await response.json();
    const ethBalanceHex = data[0].result;
    const tokenBalances = data[1].result.tokenBalances;

    // Process Native ETH
    const nativeBalance = parseInt(ethBalanceHex, 16) / 1e18;
    
    // Process Tokens (Simplified for speed - Alchemy returns raw data)
    // In a real prod app, you'd call alchemy_getTokenMetadata for each, 
    // but here we map what we can or fetch metadata for top tokens only.
    // For this demo, we return the raw structure to be normalized.
    return {
      chain: 'Ethereum',
      nativeBalance,
      tokens: tokenBalances.map(t => ({
        symbol: 'ERC20', // Alchemy requires separate call for metadata
        balance: parseInt(t.tokenBalance, 16), // Raw, needs decimals
        decimals: 18, // Assumed default for speed, or fetch metadata
        is_alchemy: true
      }))
    };
  } catch (error) {
    console.error("Alchemy Error:", error);
    return null;
  }
}

// 2. Fetch Other Chains via Moralis
async function fetchMoralisData(address, chain) {
  try {
    const [native, tokens] = await Promise.all([
      fetch(`https://deep-index.moralis.io/api/v2/${address}/balance?chain=${chain.id}`, 
        { headers: { 'X-API-Key': MORALIS_API_KEY } }).then(r => r.json()),
      fetch(`https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain.id}`, 
        { headers: { 'X-API-Key': MORALIS_API_KEY } }).then(r => r.json())
    ]);

    return {
      chain: chain.name,
      nativeBalance: parseFloat(native.balance) / 1e18,
      tokens: tokens || []
    };
  } catch (error) {
    console.error(`Moralis Error (${chain.name}):`, error);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet || !ALCHEMY_API_KEY || !MORALIS_API_KEY) {
      return NextResponse.json({ error: 'Config missing' }, { status: 400 });
    }

    // Parallel Execution Strategy
    const promises = CHAINS.map(chain => {
      if (chain.source === 'alchemy') return fetchAlchemyData(wallet);
      return fetchMoralisData(wallet, chain);
    });

    const results = await Promise.all(promises);

    // Aggregation Logic
    let totalValue = 0;
    const assets = [];

    for (const data of results) {
      if (!data) continue;

      // 1. Add Native Asset
      if (data.nativeBalance > 0) {
        // Mock price fetch for demo speed (Replace with Coingecko batch)
        const price = data.chain === 'Ethereum' ? 2500 : 
                     data.chain === 'Polygon' ? 0.8 : 300; 
        
        const value = data.nativeBalance * price;
        totalValue += value;

        assets.push({
          symbol: data.chain === 'Ethereum' ? 'ETH' : data.chain === 'Polygon' ? 'MATIC' : 'BNB',
          name: data.chain,
          balance: data.nativeBalance.toFixed(4),
          value: value,
          chain: data.chain,
          type: 'native'
        });
      }

      // 2. Add Tokens (Filtering small balances)
      // Note: For Alchemy tokens, we skipped metadata fetch for speed.
      // In production, you would fetch metadata here if is_alchemy is true.
    }

    // Sort by value
    assets.sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totalValue,
      assets,
      chains: CHAINS.map(c => c.name)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}