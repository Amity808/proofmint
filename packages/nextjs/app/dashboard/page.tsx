"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import ReceiptCard from "~~/components/common/ReceiptCard";
import StatsCard from "~~/components/common/StatsCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Dashboard: React.FC = () => {
    const { isConnected } = useAccount();
    const [receiptIds, setReceiptIds] = useState<Map<string, string>>(new Map());
    const [searchQuery, setSearchQuery] = useState("");

    // Get total receipt count from smart contract
    const { data: totalReceipts } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getTotalStats",
        args: []
    });

    // Generate receipt IDs based on total count
    const getReceiptIds = useCallback(() => {
        try {
            if (!totalReceipts) {
                console.log("totalReceipts is undefined or null");
                return;
            }

            const newMap = new Map<string, string>();
            // totalReceipts[0] is the total receipts count
            const receiptCount = Array.isArray(totalReceipts) ? totalReceipts[0] : totalReceipts;

            if (typeof receiptCount === 'bigint' && receiptCount > 0) {
                for (let i = 1; i <= receiptCount; i++) { // Receipt IDs start from 1
                    newMap.set(i.toString(), i.toString());
                }
                setReceiptIds(new Map(newMap));
            } else {
                console.log("receiptCount is not a valid bigint:", receiptCount);
            }
        } catch (error) {
            console.error("Error setting receipt IDs:", error);
        }
    }, [totalReceipts]);

    useEffect(() => {
        getReceiptIds();
    }, [totalReceipts, getReceiptIds]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Filter receipt IDs based on search query (for now, just by ID)
    const filteredReceiptIds = [...receiptIds.entries()].filter(([key]) => 
        searchQuery === "" || key.toLowerCase().includes(searchQuery.toLowerCase())
    );


    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
                        <p className="text-gray-600 mb-6">Connect your wallet to view your NFT receipts</p>
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
                                My Receipts
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">View and manage your NFT purchase receipts</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Receipts"
                        value={receiptIds.size}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="green"
                    />
                    <StatsCard
                        title="Search Results"
                        value={filteredReceiptIds.length}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                        color="blue"
                    />
                    <StatsCard
                        title="Available"
                        value={receiptIds.size > 0 ? "Active" : "None"}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                        color="purple"
                    />
                </div>


                {/* Search functionality */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search receipts..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                    />
                </div>

                {/* Receipts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReceiptIds.map(([key, value]) => (
                        <ReceiptCard
                            key={key}
                            id={value}
                            onViewDetails={(id) => console.log("View receipt:", id)}
                            onGenerateQR={(id) => console.log("Generate QR:", id)}
                            onUpdateStatus={(id, status) => console.log("Update status:", id, status)}
                        />
                    ))}
                </div>

                {filteredReceiptIds.length === 0 && receiptIds.size > 0 && (
                    <div className="text-center py-12 text-black">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-black mb-2">
                            No receipts match your search
                        </h3>
                        <p className="text-black mb-6">
                            Try adjusting your search terms or clear the search to see all receipts.
                        </p>
                    </div>
                )}

                {receiptIds.size === 0 && (
                    <div className="text-center py-12 text-black">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-black mb-2">
                            No receipts yet
                        </h3>
                        <p className="text-black mb-6">
                            Start shopping to get your first NFT receipt!
                        </p>
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Browse Marketplace
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;