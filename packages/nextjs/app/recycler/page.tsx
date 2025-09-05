"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import StatsCard from "~~/components/common/StatsCard";
import ReceiptCard from "~~/components/common/ReceiptCard";
import { dummyReceipts, dummyRecyclerStats } from "~~/data/dummyData";
import { GadgetStatus } from "~~/types";

const RecyclerDashboard: React.FC = () => {
    const { isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "available" | "history">("overview");

    // Filter receipts that are available for recycling (not already recycled)
    const availableForRecycling = dummyReceipts.filter(receipt =>
        receipt.status !== GadgetStatus.Recycled
    );

    // Filter receipts that have been recycled
    const recycledItems = dummyReceipts.filter(receipt =>
        receipt.status === GadgetStatus.Recycled
    );

    const handleRecycleItem = (receiptId: number) => {
        console.log("Recycling item:", receiptId);
        // TODO: Implement recycling transaction
    };

    const handleViewDetails = (id: number) => {
        console.log("View details for receipt:", id);
        // TODO: Implement receipt details modal
    };

    const handleGenerateQR = (id: number) => {
        console.log("Generate QR for receipt:", id);
        // TODO: Implement QR code generation
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Recycler Dashboard</h1>
                        <p className="text-gray-600 mb-6">Connect your wallet to manage recycling operations</p>
                        <ConnectButton />
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
                            <span className="brand-gradient-multi bg-clip-text text-transparent">
                                Recycler Dashboard
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Process gadget recycling and track environmental impact</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-accent/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: "overview", label: "Overview" },
                                { id: "available", label: "Available for Recycling" },
                                { id: "history", label: "Recycling History" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
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
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Recycled"
                                value={dummyRecyclerStats.totalRecycled}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                color="green"
                            />
                            <StatsCard
                                title="CO2 Saved (kg)"
                                value={dummyRecyclerStats.environmentalImpact}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                color="blue"
                            />
                            <StatsCard
                                title="Available Items"
                                value={dummyRecyclerStats.availableForRecycling}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                }
                                color="purple"
                            />
                            <StatsCard
                                title="Pending Processing"
                                value={dummyRecyclerStats.pendingRecycling}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                color="yellow"
                            />
                        </div>

                        {/* Environmental Impact */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {dummyRecyclerStats.environmentalImpact} kg
                                    </div>
                                    <div className="text-sm text-gray-600">CO2 Emissions Prevented</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {Math.round(dummyRecyclerStats.environmentalImpact * 0.5)} kg
                                    </div>
                                    <div className="text-sm text-gray-600">Raw Materials Recovered</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {dummyRecyclerStats.totalRecycled * 2}
                                    </div>
                                    <div className="text-sm text-gray-600">Trees Equivalent Saved</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Recycling Activity</h3>
                            <div className="space-y-4">
                                {recycledItems.slice(0, 5).map((receipt) => (
                                    <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{receipt.productName}</p>
                                                <p className="text-sm text-gray-600">Recycled on {receipt.purchaseDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">Recycled</p>
                                            <p className="text-sm text-gray-600">+15 kg CO2 saved</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Available for Recycling Tab */}
                {activeTab === "available" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Items Available for Recycling</h3>
                            <div className="text-sm text-gray-600">
                                {availableForRecycling.length} items ready for processing
                            </div>
                        </div>

                        {availableForRecycling.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableForRecycling.map((receipt) => (
                                    <div key={receipt.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                                            <div className="text-gray-400 text-sm">Product Image</div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{receipt.productName}</h4>
                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <p><span className="font-medium">Product ID:</span> {receipt.productId}</p>
                                                <p><span className="font-medium">Merchant:</span> {receipt.merchant}</p>
                                                <p><span className="font-medium">Status:</span>
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${receipt.status === GadgetStatus.Active ? 'bg-green-100 text-green-800' :
                                                        receipt.status === GadgetStatus.Stolen ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {receipt.status === GadgetStatus.Active ? 'Active' :
                                                            receipt.status === GadgetStatus.Stolen ? 'Stolen' : 'Misplaced'}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleRecycleItem(receipt.id)}
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Process Recycling
                                                </button>
                                                <button
                                                    onClick={() => handleViewDetails(receipt.id)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No items available for recycling</h3>
                                <p className="text-gray-600">Check back later for new items to process</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recycling History Tab */}
                {activeTab === "history" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Recycling History</h3>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Export Report
                            </button>
                        </div>

                        {recycledItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recycledItems.map((receipt) => (
                                    <ReceiptCard
                                        key={receipt.id}
                                        receipt={receipt}
                                        onViewDetails={handleViewDetails}
                                        onGenerateQR={handleGenerateQR}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No recycling history yet</h3>
                                <p className="text-gray-600">Start processing items to build your recycling history</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default RecyclerDashboard;
