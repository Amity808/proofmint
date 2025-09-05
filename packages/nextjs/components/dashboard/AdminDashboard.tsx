import React from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Dummy data for demonstration
const dummyMerchants = [
  "0x742d35Cc6634C0532925a3b8D0Ac6bc4Cb4C0C",
  "0x8ba1f109551bD432803012645Hac136c",
  "0x1234567890123456789012345678901234567890"
];

const dummyReceipts = [
  {
    id: 1,
    productName: "iPhone 15 Pro",
    merchant: "0x742d35Cc6634C0532925a3b8D0Ac6bc4Cb4C0C",
    amount: "999.99",
    status: "Verified",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    productName: "MacBook Air M3",
    merchant: "0x8ba1f109551bD432803012645Hac136c",
    amount: "1199.99",
    status: "Pending",
    timestamp: "2024-01-14T15:45:00Z"
  }
];

const AdminDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();

  // Helper function to format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-2">Connect your wallet to view the admin dashboard</p>
        <p className="text-sm text-gray-500 mb-6">Demo Mode - No wallet required</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Demo Mode</span>
          </div>
        </div>
        <div className="text-right">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Admin
          </span>
          <p className="text-xs text-gray-500 mt-1">Address: {formatAddress(address || "0x0000...0000")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Registered Merchants</h3>
        <div className="space-y-3">
          {dummyMerchants.map(merchant => (
            <div key={merchant} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold text-sm">M</span>
                </div>
                <span className="font-mono text-sm">{formatAddress(merchant)}</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Recent Receipts</h3>
        <div className="space-y-3">
          {dummyReceipts.map(receipt => (
            <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">R</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{receipt.productName}</p>
                  <p className="text-xs text-gray-500">Merchant: {formatAddress(receipt.merchant)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">${receipt.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${receipt.status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {receipt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">System Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Status: Demo Mode</p>
          <p>• Network: Ethereum</p>
          <p>• Blockchain-powered platform</p>
          <p>• Secure and transparent operations</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;