"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import StatsCard from "~~/components/common/StatsCard";
import { dummyAdminStats, dummyMerchants } from "~~/data/dummyData";

const AdminDashboard: React.FC = () => {
    const { isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "merchants" | "recyclers" | "receipts">("overview");
    const [newMerchant, setNewMerchant] = useState("");
    const [newRecycler, setNewRecycler] = useState("");

    const handleAddMerchant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMerchant) return;
        console.log("Adding merchant:", newMerchant);
        // TODO: Implement merchant addition
        setNewMerchant("");
    };

    const handleAddRecycler = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRecycler) return;
        console.log("Adding recycler:", newRecycler);
        // TODO: Implement recycler addition
        setNewRecycler("");
    };

    const handleRemoveMerchant = (address: string) => {
        console.log("Removing merchant:", address);
        // TODO: Implement merchant removal
    };

    const handleRemoveRecycler = (address: string) => {
        console.log("Removing recycler:", address);
        // TODO: Implement recycler removal
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span className="brand-gradient-multi bg-clip-text text-transparent">
                                Admin Dashboard
                            </span>
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
                                { id: "receipts", label: "Receipts" }
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
                        {/* System Health */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">System Health</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${dummyAdminStats.systemHealth === 'good' ? 'bg-green-100 text-green-800' :
                                    dummyAdminStats.systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {dummyAdminStats.systemHealth.toUpperCase()}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalUsers}</div>
                                    <div className="text-sm text-gray-600">Total Users</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalMerchants}</div>
                                    <div className="text-sm text-gray-600">Merchants</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalRecyclers}</div>
                                    <div className="text-sm text-gray-600">Recyclers</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalReceipts}</div>
                                    <div className="text-sm text-gray-600">Total Receipts</div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Users"
                                value={dummyAdminStats.totalUsers}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                }
                                color="blue"
                            />
                            <StatsCard
                                title="Active Merchants"
                                value={dummyAdminStats.totalMerchants}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                }
                                color="green"
                            />
                            <StatsCard
                                title="Verified Recyclers"
                                value={dummyAdminStats.totalRecyclers}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                color="purple"
                            />
                            <StatsCard
                                title="Total Receipts"
                                value={dummyAdminStats.totalReceipts}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                                color="yellow"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent System Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">New merchant registered</p>
                                            <p className="text-sm text-gray-600">Samsung Store joined the platform</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">2 hours ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">New receipt issued</p>
                                            <p className="text-sm text-gray-600">iPhone 15 Pro receipt #1234</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">4 hours ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Item recycled</p>
                                            <p className="text-sm text-gray-600">MacBook Air M3 successfully recycled</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">6 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Merchants Tab */}
                {activeTab === "merchants" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Merchant Management</h3>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Add Merchant
                            </button>
                        </div>

                        {/* Add Merchant Form */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Add New Merchant</h4>
                            <form onSubmit={handleAddMerchant} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newMerchant}
                                    onChange={(e) => setNewMerchant(e.target.value)}
                                    placeholder="Enter merchant wallet address (0x...)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Add Merchant
                                </button>
                            </form>
                        </div>

                        {/* Merchants List */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Registered Merchants</h4>
                            <div className="space-y-3">
                                {dummyMerchants.map((merchant, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 font-semibold text-sm">M</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{merchant}</p>
                                                <p className="text-sm text-gray-600">Verified Merchant</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
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
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recyclers Tab */}
                {activeTab === "recyclers" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Recycler Management</h3>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Add Recycler
                            </button>
                        </div>

                        {/* Add Recycler Form */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Add New Recycler</h4>
                            <form onSubmit={handleAddRecycler} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newRecycler}
                                    onChange={(e) => setNewRecycler(e.target.value)}
                                    placeholder="Enter recycler wallet address (0x...)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Add Recycler
                                </button>
                            </form>
                        </div>

                        {/* Recyclers List */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Registered Recyclers</h4>
                            <div className="space-y-3">
                                {["EcoRecycle Ltd", "GreenTech Solutions", "Sustainable Disposal Co"].map((recycler, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                <span className="text-purple-600 font-semibold text-sm">R</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{recycler}</p>
                                                <p className="text-sm text-gray-600">Verified Recycler</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                Active
                                            </span>
                                            <button
                                                onClick={() => handleRemoveRecycler(recycler)}
                                                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Receipt Management</h3>
                        <p className="text-gray-600">Receipt management features coming soon</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
