import { MetaMaskSDK } from '@metamask/sdk';

let sdk = null;
let ethereum = null;

export const initializeMetaMask = () => {
  if (typeof window === 'undefined') return null;

  if (!sdk) {
    sdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'PORTLY.AI',
        url: typeof window !== 'undefined' ? window.location.href : '',
      },
      preferDesktop: true,
      checkInstallationImmediately: false,
    });

    ethereum = sdk.getProvider();
  }

  return ethereum;
};

export const connectWallet = async () => {
  try {
    const provider = initializeMetaMask();
    
    if (!provider) {
      throw new Error('MetaMask SDK not initialized');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    const chainId = await provider.request({
      method: 'eth_chainId',
    });

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      provider,
    };
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  if (sdk) {
    sdk.terminate();
    sdk = null;
    ethereum = null;
  }
};

export const getBalance = async (address) => {
  try {
    const provider = initializeMetaMask();
    
    if (!provider) {
      throw new Error('Provider not available');
    }

    const balance = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });

    return parseInt(balance, 16) / 1e18; // Convert Wei to ETH
  } catch (error) {
    console.error('Get balance error:', error);
    return 0;
  }
};

export const switchNetwork = async (chainId) => {
  try {
    const provider = initializeMetaMask();
    
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    console.error('Switch network error:', error);
    throw error;
  }
};

export const watchAccount = (callback) => {
  const provider = initializeMetaMask();
  
  if (!provider) return null;

  provider.on('accountsChanged', (accounts) => {
    callback(accounts[0] || null);
  });

  provider.on('chainChanged', (chainId) => {
    window.location.reload();
  });

  return () => {
    provider.removeAllListeners('accountsChanged');
    provider.removeAllListeners('chainChanged');
  };
};
