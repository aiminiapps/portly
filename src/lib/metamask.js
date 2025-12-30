'use client';

import { MetaMaskSDK } from '@metamask/sdk';

class MetaMaskManager {
  constructor() {
    this.sdk = null;
    this.provider = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (typeof window === 'undefined') {
      console.warn('MetaMask can only be initialized in browser');
      return null;
    }

    if (this.isInitialized && this.provider) {
      return this.provider;
    }

    try {
      // Check if MetaMask is already injected
      if (window.ethereum && window.ethereum.isMetaMask) {
        this.provider = window.ethereum;
        this.isInitialized = true;
        console.log('Using injected MetaMask provider');
        return this.provider;
      }

      // Initialize MetaMask SDK for mobile and non-injected scenarios
      this.sdk = new MetaMaskSDK({
        dappMetadata: {
          name: 'PORTLY',
          url: window.location.origin,
        },
        preferDesktop: true,
        checkInstallationImmediately: false,
        logging: {
          developerMode: false,
        },
      });

      this.provider = this.sdk.getProvider();
      this.isInitialized = true;
      console.log('MetaMask SDK initialized');
      return this.provider;
    } catch (error) {
      console.error('Failed to initialize MetaMask:', error);
      throw new Error('Failed to initialize MetaMask. Please make sure MetaMask is installed.');
    }
  }

  getProvider() {
    return this.provider;
  }

  isReady() {
    return this.isInitialized && this.provider !== null;
  }

  reset() {
    if (this.sdk) {
      this.sdk.terminate();
    }
    this.sdk = null;
    this.provider = null;
    this.isInitialized = false;
  }
}

// Singleton instance
const metaMaskManager = new MetaMaskManager();

export const initializeMetaMask = async () => {
  return await metaMaskManager.initialize();
};

export const connectWallet = async () => {
  try {
    const provider = await initializeMetaMask();

    if (!provider) {
      throw new Error('MetaMask provider not available. Please install MetaMask extension.');
    }

    // Request account access
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    // Get chain ID
    const chainId = await provider.request({
      method: 'eth_chainId',
    });

    console.log('Wallet connected:', accounts[0]);

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      provider,
    };
  } catch (error) {
    console.error('Wallet connection error:', error);
    
    // User rejected request
    if (error.code === 4001) {
      throw new Error('Connection request rejected. Please approve the connection in MetaMask.');
    }
    
    // MetaMask not installed
    if (error.code === -32002) {
      throw new Error('Connection request already pending. Please check MetaMask.');
    }

    throw error;
  }
};

export const disconnectWallet = () => {
  metaMaskManager.reset();
  console.log('Wallet disconnected');
};

export const getBalance = async (address) => {
  try {
    const provider = metaMaskManager.getProvider();

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
    const provider = metaMaskManager.getProvider();

    if (!provider) {
      throw new Error('Provider not available');
    }

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
  const provider = metaMaskManager.getProvider();

  if (!provider) {
    console.warn('Provider not available for watching accounts');
    return null;
  }

  const handleAccountsChanged = (accounts) => {
    console.log('Accounts changed:', accounts);
    callback(accounts[0] || null);
  };

  const handleChainChanged = (chainId) => {
    console.log('Chain changed:', chainId);
    // Reload page on chain change as recommended by MetaMask
    window.location.reload();
  };

  provider.on('accountsChanged', handleAccountsChanged);
  provider.on('chainChanged', handleChainChanged);

  return () => {
    provider.removeListener('accountsChanged', handleAccountsChanged);
    provider.removeListener('chainChanged', handleChainChanged);
  };
};

export const getAccounts = async () => {
  try {
    const provider = metaMaskManager.getProvider();

    if (!provider) {
      return [];
    }

    const accounts = await provider.request({
      method: 'eth_accounts',
    });

    return accounts || [];
  } catch (error) {
    console.error('Get accounts error:', error);
    return [];
  }
};
