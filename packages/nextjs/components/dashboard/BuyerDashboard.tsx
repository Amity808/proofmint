import React from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Dummy data for demonstration
const dummyGadgets = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "999.99",
    seller: "0x742d35Cc6634C0532925a3b8D0Ac6bc4Cb4C0C",
    sold: false,
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: "1199.99",
    seller: "0x8ba1f109551bD432803012645Hac136c",
    sold: false,
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: "799.99",
    seller: "0x1234567890123456789012345678901234567890",
    sold: true,
    image: "/api/placeholder/300/200"
  }
];

const dummyReceipts = [
  {
    id: 1,
    productName: "iPhone 15 Pro",
    tokenId: "12345",
    purchaseDate: "2024-01-15",
    price: "999.99",
    status: "Verified"
  },
  {
    id: 2,
    productName: "MacBook Air M3",
    tokenId: "12346",
    purchaseDate: "2024-01-10",
    price: "1199.99",
    status: "Pending"
  }
];

const BuyerDashboard = () => {
  const { address, isConnected } = useAccount();

  // Helper function to format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to ProofMint</h1>
        <p className="mb-6">Connect your wallet to get started</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Demo Mode</span>
          </div>
        </div>
        <div className="text-right">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Buyer
          </span>
          <p className="text-xs text-gray-500 mt-1">Address: {formatAddress(address || "0x0000...0000")}</p>
        </div>
      </div>

      {/* Available Gadgets */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Available Gadgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyGadgets.filter(gadget => !gadget.sold).map((gadget) => (
            <div key={gadget.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-400 text-sm">Product Image</div>
              </div>
              <h4 className="font-semibold text-lg mb-2">{gadget.name}</h4>
              <p className="text-gray-600 text-sm mb-2">Seller: {formatAddress(gadget.seller)}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">${gadget.price}</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Receipts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">My Receipts</h3>
        <div className="space-y-3">
          {dummyReceipts.map((receipt) => (
            <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">R</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{receipt.productName}</p>
                  <p className="text-xs text-gray-500">Token ID: {receipt.tokenId} | Date: {receipt.purchaseDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">${receipt.price}</p>
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

      {/* Recycling Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Request Recycling</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter NFT Token ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled
          />
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Request Recycling
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Enter the Token ID of an NFT you want to recycle for rewards</p>
      </div>
    </div>
  );
};

export default BuyerDashboard;