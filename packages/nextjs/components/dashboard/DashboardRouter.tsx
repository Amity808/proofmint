import React, { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUserRoles } from "../../hooks/useContractQueries";
import { isAddress } from "viem";

// Import your dashboard components
import NewAdminDashboard from "./NewAdminDashboard";
import NewMerchantDashboard from "./NewMerchantDashboard";
import NewBuyerDashboard from "./NewBuyerDashboard";
import RecyclerDashboard from "./RecyclerDashboard";

interface DashboardRouterProps {
  // Optional override for testing
  forceRole?: 'admin' | 'merchant' | 'recycler' | 'user';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ forceRole }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Ethereum Mainnet chain ID
  const ETHEREUM_MAINNET_ID = 1;

  // Validate address safely
  const accountAddress = address && isAddress(address) ? address : undefined;

  // Only call hook if address is valid
  const { data: userRoles, error: rolesError, isLoading: rolesLoading } = useUserRoles(accountAddress);

  // Check if user is on correct network

  
  useEffect(() => {
    if (chainId && chainId !== ETHEREUM_MAINNET_ID) {
      setNetworkError("This application works best on Ethereum Mainnet. Please switch to the correct network.");
    } else {
      setNetworkError(null);
    }
  }, [chainId]);

  useEffect(() => {
    // Set loading to false once we have connection status and role data
    if (!isConnected || (!rolesLoading && (userRoles || rolesError))) {
      setLoading(false);
    }
  }, [isConnected, rolesLoading, userRoles, rolesError]);

  const handleAddNetworkToWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: '0x1', // 1 in hex for Ethereum Mainnet
          }],
        });
      } catch (error) {
        console.error('Failed to add network:', error);
        alert('Failed to add network to wallet');
      }
    } else {
      alert('Please install a Web3 wallet like MetaMask');
    }
  };

  // Show wallet connection screen
  if (!isConnected || !accountAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Welcome to ProofMint</h1>
          <p className="mb-2 text-gray-600">Connect your wallet to access your personalized dashboard</p>
          <p className="text-sm text-gray-500 mb-8">Network: Ethereum</p>
          <ConnectButton />
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Admin: Manage merchants and system overview</li>
              <li>• Merchant: Issue receipts and manage sales</li>
              <li>• Recycler: Process recyclable items</li>
              <li>• Buyer: View purchases and track items</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show network error if not on correct network
  if (networkError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Unsupported Network</h1>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <p className="text-orange-800 mb-4">{networkError}</p>
            <p className="text-sm text-gray-600 mb-4">
              Detected network: {chainId ? `Chain ID ${chainId}` : 'Unknown'}
              <br />
              Required: Ethereum Mainnet
            </p>
            <div className="space-y-3">
              <button
                onClick={handleAddNetworkToWallet}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Switch to Ethereum Mainnet
              </button>
              <p className="text-xs text-gray-500">
                After adding, manually switch to Ethereum Mainnet in your wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while determining user role
  if (loading || rolesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Preparing Your Dashboard</h2>
          <p className="text-gray-600 mb-4">Checking your roles and permissions...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle role loading error
  if (rolesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">We couldn't determine your account roles. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Page
          </button>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left text-sm text-gray-600">
            <p>Error: {rolesError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine which dashboard to show based on roles
  const getUserRole = () => {
    if (forceRole) return forceRole; // For testing purposes
    
    // Check roles in priority order (admin has highest priority)
    if (userRoles?.hasDefaultAdminRole || userRoles?.hasAdminRole) return 'admin';
    if (userRoles?.hasMerchantRole) return 'merchant';
    if (userRoles?.hasRecyclerRole) return 'recycler';
    return 'user';
  };

  const userRole = getUserRole();

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'admin':
      return <NewAdminDashboard />;
    
    case 'merchant':
      return <NewMerchantDashboard />;
    
    case 'recycler':
      return <RecyclerDashboard />;
    
    case 'user':
    default:
      return <NewBuyerDashboard />;
  }
};

export default DashboardRouter;