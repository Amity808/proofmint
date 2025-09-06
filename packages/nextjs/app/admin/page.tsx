"use client";

import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import StatsCard from "~~/components/common/StatsCard";
import Footer from "~~/components/home/Footer";
import Header from "~~/components/home/Header";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Removed dummy data imports

const AdminDashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "merchants" | "recyclers" | "receipts" | "subscriptions" | "funds"
  >("overview");
  const [newMerchant, setNewMerchant] = useState("");
  const [newRecycler, setNewRecycler] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [subscriptionPricing, setSubscriptionPricing] = useState<any>(null);
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [basePayMerchant, setBasePayMerchant] = useState("");
  const [basePayTier, setBasePayTier] = useState<"0" | "1" | "2">("0");
  const [basePayDuration, setBasePayDuration] = useState("1");
  const [basePayPaymentId, setBasePayPaymentId] = useState("");

  // Smart contract hooks
  const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
    contractName: "ProofMint",
  });

  // Read contract data
  const { data: totalReceipts } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getTotalStats",
  });

  // Read all receipts
  const { data: receiptsData } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "viewAllReceipts",
  });

  // Read subscription pricing
  const { data: pricingData } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getSubscriptionPricing",
  });

  // Read contract owner
  const { data: contractOwner } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "owner",
  });

  // Read all verified merchants (we'll get this from receipts data)
  const [verifiedMerchants, setVerifiedMerchants] = useState<string[]>([]);

  // Check if current user is admin
  const isAdmin = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  // Effects
  useEffect(() => {
    if (receiptsData) {
      setAllReceipts(receiptsData);
      // Extract unique merchants from receipts
      const merchants = new Set<string>();
      receiptsData.forEach((receipt: any) => {
        if (receipt.merchant) {
          merchants.add(receipt.merchant);
        }
      });
      setVerifiedMerchants(Array.from(merchants));
    }
  }, [receiptsData]);

  useEffect(() => {
    if (pricingData) {
      setSubscriptionPricing(pricingData);
    }
  }, [pricingData]);

  // Admin functions
  const handleWithdrawFunds = async () => {
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Withdrawing ETH funds...", { id: "withdraw" });
      const result = await writeProofMintAsync({
        functionName: "withdrawFunds",
      });
      console.log("Funds withdrawn successfully:", result);
      toast.success("ETH funds withdrawn successfully! Transaction hash: " + result, { id: "withdraw" });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds. Please try again.", { id: "withdraw" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawUSDC = async () => {
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Withdrawing USDC funds...", { id: "withdraw-usdc" });
      const result = await writeProofMintAsync({
        functionName: "withdrawUSDC",
      });
      console.log("USDC funds withdrawn successfully:", result);
      toast.success("USDC funds withdrawn successfully! Transaction hash: " + result, { id: "withdraw-usdc" });
    } catch (error) {
      console.error("Error withdrawing USDC:", error);
      toast.error("Failed to withdraw USDC. Please try again.", { id: "withdraw-usdc" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseMerchantSubscription = async (merchantAddress: string, pause: boolean) => {
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading(`${pause ? "Pausing" : "Unpausing"} merchant subscription...`, { id: "pause-subscription" });
      const result = await writeProofMintAsync({
        functionName: "pauseMerchantSubscription",
        args: [merchantAddress, pause],
      });
      console.log("Subscription paused/unpaused successfully:", result);
      toast.success(
        `Merchant subscription ${pause ? "paused" : "unpaused"} successfully! Transaction hash: ${result}`,
        { id: "pause-subscription" },
      );
    } catch (error) {
      console.error("Error pausing/unpausing subscription:", error);
      toast.error("Failed to update subscription. Please try again.", { id: "pause-subscription" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateBasePaySubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    if (!basePayMerchant || !basePayPaymentId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Activating Base Pay subscription...", { id: "basepay" });
      const result = await writeProofMintAsync({
        functionName: "activateSubscriptionFromBasePay",
        args: [basePayMerchant, parseInt(basePayTier), parseInt(basePayDuration), basePayPaymentId],
      });
      console.log("Base Pay subscription activated successfully:", result);
      toast.success("Base Pay subscription activated successfully! Transaction hash: " + result, { id: "basepay" });
      setBasePayMerchant("");
      setBasePayPaymentId("");
      setBasePayDuration("1");
      setBasePayTier("0");
    } catch (error) {
      console.error("Error activating Base Pay subscription:", error);
      toast.error("Failed to activate subscription. Please try again.", { id: "basepay" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant) return;
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    // Basic Ethereum address validation
    if (!newMerchant.startsWith("0x") || newMerchant.length !== 42) {
      toast.error("Please enter a valid Ethereum address (0x...)");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Adding merchant:", newMerchant);
      toast.loading("Adding merchant to blockchain...", { id: "merchant" });

      const result = await writeProofMintAsync({
        functionName: "addMerchant",
        args: [newMerchant],
      });

      console.log("Merchant added successfully:", result);
      toast.success("Merchant added successfully! Transaction hash: " + result, { id: "merchant" });
      setNewMerchant("");
    } catch (error) {
      console.error("Error adding merchant:", error);
      toast.error("Failed to add merchant. Please try again.", { id: "merchant" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecycler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecycler) return;
    if (!writeProofMintAsync) {
      toast.error("Contract not available");
      return;
    }

    // Basic Ethereum address validation
    if (!newRecycler.startsWith("0x") || newRecycler.length !== 42) {
      toast.error("Please enter a valid Ethereum address (0x...)");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Adding recycler:", newRecycler);
      toast.loading("Adding recycler to blockchain...", { id: "recycler" });

      const result = await writeProofMintAsync({
        functionName: "addRecycler",
        args: [newRecycler],
      });

      console.log("Recycler added successfully:", result);
      toast.success("Recycler added successfully! Transaction hash: " + result, { id: "recycler" });
      setNewRecycler("");
    } catch (error) {
      console.error("Error adding recycler:", error);
      toast.error("Failed to add recycler. Please try again.", { id: "recycler" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMerchant = (address: string) => {
    console.log("Removing merchant:", address);
    toast.error("Merchant removal not implemented in contract");
  };

  const handleRemoveRecycler = (address: string) => {
    console.log("Removing recycler:", address);
    toast.error("Recycler removal not implemented in contract");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to access admin functions</p>
            <ConnectButton />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You are not authorized to access admin functions</p>
            <p className="text-sm text-gray-500">Contract Owner: {contractOwner}</p>
            <p className="text-sm text-gray-500">Your Address: {address}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="brand-gradient-multi bg-clip-text text-transparent">Admin Dashboard</span>
            </h1>
            <p className="text-lg text-gray-600">Manage system users, merchants, and recyclers</p>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "users", label: "Users" },
                { id: "merchants", label: "Merchants" },
                { id: "recyclers", label: "Recyclers" },
                { id: "receipts", label: "Receipts" },
                { id: "subscriptions", label: "Subscriptions" },
                { id: "funds", label: "Funds" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* System Health */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">ACTIVE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{verifiedMerchants.length}</div>
                  <div className="text-sm text-gray-600">Active Merchants</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{allReceipts.length}</div>
                  <div className="text-sm text-gray-600">Total Receipts</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{contractOwner ? "1" : "0"}</div>
                  <div className="text-sm text-gray-600">Admins</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {allReceipts.filter((r: any) => r.gadgetStatus === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Gadgets</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Merchants</p>
                    <p className="text-2xl font-bold text-blue-600">{verifiedMerchants.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                    <p className="text-2xl font-bold text-green-600">{allReceipts.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Gadgets</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {allReceipts.filter((r: any) => r.gadgetStatus === 0).length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stolen/Lost</p>
                    <p className="text-2xl font-bold text-red-600">
                      {allReceipts.filter((r: any) => r.gadgetStatus === 1 || r.gadgetStatus === 2).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {allReceipts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  allReceipts
                    .slice(-3)
                    .reverse()
                    .map((receipt: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Receipt #{receipt.id?.toString()}</p>
                            <p className="text-sm text-gray-600">
                              {receipt.gadgetStatus === 0
                                ? "Active"
                                : receipt.gadgetStatus === 1
                                  ? "Stolen"
                                  : receipt.gadgetStatus === 2
                                    ? "Lost"
                                    : receipt.gadgetStatus === 3
                                      ? "Recycled"
                                      : "Unknown"}{" "}
                              gadget
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(Number(receipt.timestamp) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Merchants Tab */}
        {activeTab === "merchants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Merchant Management</h3>
              <button className="px-4 py-2 brand-gradient-primary text-white rounded-lg hover:shadow-brand-primary transition-all">
                Add Merchant
              </button>
            </div>

            {/* Add Merchant Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20 p-6">
              <h4 className="text-lg font-medium mb-4">Add New Merchant</h4>
              <form onSubmit={handleAddMerchant} className="flex gap-4">
                <input
                  type="text"
                  value={newMerchant}
                  onChange={e => setNewMerchant(e.target.value)}
                  placeholder="Enter merchant wallet address (0x...)"
                  className="flex-1 p-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 brand-gradient-primary text-white rounded-lg hover:shadow-brand-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Merchant</span>
                  )}
                </button>
              </form>
            </div>

            {/* Merchants List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Registered Merchants</h4>
              <div className="space-y-3">
                {verifiedMerchants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No merchants registered yet</p>
                  </div>
                ) : (
                  verifiedMerchants.map((merchant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">M</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{merchant}</p>
                          <p className="text-sm text-gray-600">Verified Merchant</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                        <button
                          onClick={() => handleRemoveMerchant(merchant)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recyclers Tab */}
        {activeTab === "recyclers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recycler Management</h3>
              <button className="px-4 py-2 brand-gradient-secondary text-white rounded-lg hover:shadow-brand-secondary transition-all">
                Add Recycler
              </button>
            </div>

            {/* Add Recycler Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-secondary border border-brand-secondary/20 p-6">
              <h4 className="text-lg font-medium mb-4">Add New Recycler</h4>
              <form onSubmit={handleAddRecycler} className="flex gap-4">
                <input
                  type="text"
                  value={newRecycler}
                  onChange={e => setNewRecycler(e.target.value)}
                  placeholder="Enter recycler wallet address (0x...)"
                  className="flex-1 p-3 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 brand-gradient-secondary text-white rounded-lg hover:shadow-brand-secondary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Recycler</span>
                  )}
                </button>
              </form>
            </div>

            {/* Recyclers List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Registered Recyclers</h4>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <p className="text-gray-500">No recyclers registered yet</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === "users" && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management features coming soon</p>
          </div>
        )}

        {activeTab === "receipts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Receipt Management</h3>
              <div className="text-sm text-gray-600">Total Receipts: {allReceipts.length}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">All Receipts</h4>
              {allReceipts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No receipts found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Merchant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Buyer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IPFS Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allReceipts.map((receipt, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {receipt.id?.toString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {receipt.merchant?.slice(0, 6)}...{receipt.merchant?.slice(-4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {receipt.buyer?.slice(0, 6)}...{receipt.buyer?.slice(-4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                receipt.gadgetStatus === 0
                                  ? "bg-green-100 text-green-800"
                                  : receipt.gadgetStatus === 1
                                    ? "bg-red-100 text-red-800"
                                    : receipt.gadgetStatus === 2
                                      ? "bg-yellow-100 text-yellow-800"
                                      : receipt.gadgetStatus === 3
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {receipt.gadgetStatus === 0
                                ? "Active"
                                : receipt.gadgetStatus === 1
                                  ? "Stolen"
                                  : receipt.gadgetStatus === 2
                                    ? "Lost"
                                    : receipt.gadgetStatus === 3
                                      ? "Recycled"
                                      : "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(Number(receipt.timestamp) * 1000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a
                              href={`https://ipfs.io/ipfs/${receipt.ipfsHash?.replace("ipfs://", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {receipt.ipfsHash?.slice(0, 20)}...
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subscription Management</h3>
            </div>

            {/* Subscription Pricing */}
            {subscriptionPricing && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Subscription Pricing (USDC)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-600">Basic</h5>
                    <p className="text-2xl font-bold text-blue-600">${Number(subscriptionPricing[0]) / 1000000}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-600">Premium</h5>
                    <p className="text-2xl font-bold text-green-600">${Number(subscriptionPricing[1]) / 1000000}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-600">Enterprise</h5>
                    <p className="text-2xl font-bold text-purple-600">${Number(subscriptionPricing[2]) / 1000000}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Yearly Discount: {subscriptionPricing[3]}% off for 12-month subscriptions
                  </p>
                </div>
              </div>
            )}

            {/* Base Pay Integration */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Base Pay Subscription Activation</h4>
              <form onSubmit={handleActivateBasePaySubscription} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Address</label>
                    <input
                      type="text"
                      value={basePayMerchant}
                      onChange={e => setBasePayMerchant(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment ID</label>
                    <input
                      type="text"
                      value={basePayPaymentId}
                      onChange={e => setBasePayPaymentId(e.target.value)}
                      placeholder="Base Pay payment ID"
                      className="w-full p-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Tier</label>
                    <select
                      value={basePayTier}
                      onChange={e => setBasePayTier(e.target.value as "0" | "1" | "2")}
                      className="w-full p-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    >
                      <option value="0">Basic</option>
                      <option value="1">Premium</option>
                      <option value="2">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months)</label>
                    <input
                      type="number"
                      value={basePayDuration}
                      onChange={e => setBasePayDuration(e.target.value)}
                      min="1"
                      max="12"
                      className="w-full p-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 brand-gradient-primary text-white rounded-lg hover:shadow-brand-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Activating...</span>
                    </>
                  ) : (
                    <span>Activate Subscription</span>
                  )}
                </button>
              </form>
            </div>

            {/* Merchant Subscription Management */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Merchant Subscriptions</h4>
              <div className="space-y-3">
                {verifiedMerchants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No merchants with subscriptions</p>
                  </div>
                ) : (
                  verifiedMerchants.map((merchant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">M</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{merchant}</p>
                          <p className="text-sm text-gray-600">Verified Merchant</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePauseMerchantSubscription(merchant, true)}
                          className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm"
                          disabled={isLoading}
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => handlePauseMerchantSubscription(merchant, false)}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                          disabled={isLoading}
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Funds Tab */}
        {activeTab === "funds" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Funds Management</h3>
            </div>

            {/* Contract Balance */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Contract Balances</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-blue-600">ETH Balance</h5>
                      <p className="text-2xl font-bold text-blue-600">{contractBalance} ETH</p>
                    </div>
                    <button
                      onClick={handleWithdrawFunds}
                      disabled={isLoading || contractBalance === "0"}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Withdraw ETH
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-green-600">USDC Balance</h5>
                      <p className="text-2xl font-bold text-green-600">{usdcBalance} USDC</p>
                    </div>
                    <button
                      onClick={handleWithdrawUSDC}
                      disabled={isLoading || usdcBalance === "0"}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Withdraw USDC
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Withdrawal History</h4>
              <div className="text-center py-8">
                <p className="text-gray-500">Withdrawal history will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
